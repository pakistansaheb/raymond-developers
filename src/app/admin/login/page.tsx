import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/AdminShell";
import { getAdminEmail } from "@/lib/admin-auth";
import { adminConfigured } from "@/lib/env";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (adminConfigured() && (await getAdminEmail())) {
    redirect("/admin");
  }

  return (
    <AdminShell>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="t-mono text-graphite">ADMIN / NOT CONFIGURED</p>
          <h1 className="t-display t-d3">Admin isn&rsquo;t set up.</h1>
          <p className="t-lead text-graphite">
            Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET in your
            environment, then reload. Generate a password hash with{" "}
            <code className="text-chalk">npm run hash-password</code>.
          </p>
        </div>
      )}
    </AdminShell>
  );
}
