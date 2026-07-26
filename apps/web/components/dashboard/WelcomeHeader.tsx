import { Calendar } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  organizationName: string;
}

export default function WelcomeHeader({ userName, organizationName }: WelcomeHeaderProps) {
  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 18) greeting = "Good Afternoon";

  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="mt-1 text-slate-400">
          Here is what's happening at <span className="font-semibold text-slate-300">{organizationName}</span> today.
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-xl ring-1 ring-inset ring-cyan-500/20 w-fit">
        <Calendar className="h-4 w-4" />
        {dateString}
      </div>
    </div>
  );
}
