"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Building2, ClipboardList, PackageSearch, Settings, Users, Workflow } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import { WorkspaceShell, ui } from "../../components/workspace-shell";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!data.user) {
          router.replace("/login");
          return;
        }
        if (active) {
          setEmail(data.user.email ?? "Authenticated user");
          setUserId(data.user.id);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Unable to verify the signed-in user.");
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => { active = false; };
  }, [router]);

  const actions = [
    { href: "/settings", title: "Company settings", description: "Manage company profile, currency, sourcing region and quotation defaults.", icon: Building2 },
    { href: "/leads", title: "Lead register", description: "Review and manage procurement opportunities.", icon: ClipboardList },
    { href: "/suppliers", title: "Supplier directory", description: "Maintain supplier contacts and verification details.", icon: PackageSearch },
    { href: "/", title: "Workspace overview", description: "View the current procurement workflow and activity.", icon: Activity },
  ];

  return <WorkspaceShell title="Admin workspace" description="Account information and workspace configuration for AUTOPS.">
    <section style={{ ...ui.card, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 13, background: "#eef0ff", color: "#4659d9" }}><Users size={23} /></span>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>Signed-in account</h2>
          {checking ? <p style={{ margin: 0, color: "#718098" }}>Checking session…</p> : error ? <p role="alert" style={{ margin: 0, color: "#a12b25" }}>{error}</p> : <><p style={{ margin: "0 0 4px", fontWeight: 700 }}>{email}</p><p style={{ margin: 0, fontSize: 12, color: "#718098" }}>User ID: {userId}</p></>}
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#718098", lineHeight: 1.6, marginBottom: 0 }}>This page confirms the authenticated account and provides links to the existing workspace controls. It does not create users or grant administrator privileges.</p>
    </section>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
      {actions.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} style={{ ...ui.card, margin: 0, textDecoration: "none", color: "#17233d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 10, background: "#eef0ff", color: "#4659d9" }}><Icon size={18} /></span><strong>{item.title}</strong></div>
        <p style={{ fontSize: 12, color: "#718098", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
        <p style={{ fontSize: 12, color: "#4659d9", fontWeight: 700, marginBottom: 0 }}>Open page →</p>
      </Link>; })}
    </div>
  </WorkspaceShell>;
}
