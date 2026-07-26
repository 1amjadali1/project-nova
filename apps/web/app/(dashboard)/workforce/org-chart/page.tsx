import { prisma } from "@/lib/prisma";
import { Network, UserCircle } from "lucide-react";

export default async function OrgChartPage() {
  const profiles = await prisma.employeeProfile.findMany({
    include: {
      user: true,
      department: true,
      designation: true,
    },
  });

  // Build tree
  const profileMap = new Map();
  profiles.forEach((p) => {
    profileMap.set(p.id, { ...p, children: [] });
  });

  const rootProfiles: any[] = [];
  profiles.forEach((p) => {
    if (p.managerId && profileMap.has(p.managerId)) {
      profileMap.get(p.managerId).children.push(profileMap.get(p.id));
    } else {
      rootProfiles.push(profileMap.get(p.id));
    }
  });

  const OrgNode = ({ node }: { node: any }) => {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm min-w-[200px] text-center mb-4 relative z-10">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <UserCircle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{node.user.name}</h3>
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-1">{node.designation?.name || "No Designation"}</p>
          <p className="text-xs text-slate-500 mt-0.5">{node.department?.name || "No Dept"}</p>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="relative w-full">
            {/* Vertical line down from parent */}
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 absolute -top-4 left-1/2 -translate-x-1/2"></div>
            
            {/* Horizontal line connecting children */}
            {node.children.length > 1 && (
              <div className="absolute top-2 left-0 right-0 h-px bg-slate-300 dark:bg-slate-600" 
                   style={{ 
                     width: \`calc(100% - \${100 / node.children.length}%)\`,
                     left: \`\${50 / node.children.length}%\`
                   }}></div>
            )}

            <div className="flex justify-center gap-6 pt-4">
              {node.children.map((child: any) => (
                <div key={child.id} className="relative">
                   {/* Vertical line up from child */}
                  <div className="w-px h-2 bg-slate-300 dark:bg-slate-600 absolute -top-4 left-1/2 -translate-x-1/2"></div>
                  <OrgNode node={child} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg">
          <Network className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Chart</h1>
          <p className="text-slate-500 text-sm mt-1">Visual hierarchy of workforce personnel.</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-12 pt-4 hide-scrollbar">
        <div className="min-w-max flex justify-center p-4">
          {rootProfiles.length > 0 ? (
            <div className="flex gap-12">
              {rootProfiles.map((root) => (
                <OrgNode key={root.id} node={root} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/50 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl w-full max-w-lg">
              No employee profiles found in the system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
