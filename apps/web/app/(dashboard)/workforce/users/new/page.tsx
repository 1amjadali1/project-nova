import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewEmployeePage() {
  const [departments, designations, managers, organizations] = await Promise.all([
    prisma.department.findMany(),
    prisma.designation.findMany(),
    prisma.employeeProfile.findMany({ include: { user: true } }),
    prisma.organization.findMany()
  ]);

  async function createEmployee(formData: FormData) {
    "use server";
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const organizationId = formData.get("organizationId") as string;
    const departmentId = formData.get("departmentId") as string;
    const designationId = formData.get("designationId") as string;
    const managerId = formData.get("managerId") as string;
    const employeeId = formData.get("employeeId") as string;

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        organizationId,
        isActive: true,
        employeeProfile: {
          create: {
            employeeId: employeeId || undefined,
            departmentId: departmentId || undefined,
            designationId: designationId || undefined,
            managerId: managerId || undefined,
            joiningDate: new Date(),
          }
        }
      }
    });

    revalidatePath("/workforce/users");
    redirect(`/workforce/users/${user.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Onboard New Employee</h2>
          <p className="text-slate-400">Create a user account and HR profile.</p>
        </div>
        <Link 
          href="/workforce/users"
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
        <form action={createEmployee} className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">First Name *</label>
                <input required name="firstName" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Last Name *</label>
                <input required name="lastName" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-slate-300">Email Address *</label>
                <input required type="email" name="email" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Employee ID</label>
                <input name="employeeId" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500" placeholder="e.g. EMP-1042" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Organization *</label>
                <select required name="organizationId" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500">
                  <option value="">Select Organization...</option>
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Department</label>
                <select name="departmentId" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500">
                  <option value="">Select Department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Designation / Role</label>
                <select name="designationId" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500">
                  <option value="">Select Designation...</option>
                  {designations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-slate-300">Reporting Manager</label>
                <select name="managerId" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:border-cyan-500">
                  <option value="">No Manager (Top Level)</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.id}>{m.user.firstName} {m.user.lastName} ({m.user.email})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
