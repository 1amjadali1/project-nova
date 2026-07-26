import { redirect } from "next/navigation";

export default function RootPage() {
  // The actual login page is at /login. This root page was a UI stub.
  redirect("/dashboard");
}
