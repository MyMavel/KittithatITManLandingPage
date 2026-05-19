import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/login/actions";

export default function Header({ user }: { user: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-sm font-medium text-slate-600">
        Signed in as <span className="text-slate-900">{user}</span>
      </h1>
      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </header>
  );
}
