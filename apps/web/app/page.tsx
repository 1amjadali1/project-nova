import Card from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <Card>
        <Logo />

        <div className="mt-6 space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="john@company.com"
            />
          </div>

          <Button>
            Sign In
          </Button>
        </div>
      </Card>
    </main>
  );
}
