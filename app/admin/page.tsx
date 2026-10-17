"use client";
import Link from "next/link";
import { Activity, Building2, ClipboardList, PackageSearch, Users } from "lucide-react";
import { WorkspaceShell, ui } from "../../components/workspace-shell";
export default function AdminPage() {
  const actions = [
    { href: "/settings", title: "Company settings", description: "Manage company profile, currency, sourcing region and quotation defaults.", icon: Building2 },
    { href: "/leads", title: "Lead register", description: "Review and manage procurement opportunities.", icon: ClipboardList },
    { href: "/suppliers", title: "Supplier directory", description: "Maintain supplier contacts and verification details.", icon: PackageSearch },
    { href: "/", title: "Workspace overview", description: "View the current procurement workflow and activity.", icon: Activity },
  ];
  return <WorkspaceShell title="Admin workspace" description="Workspace configuration and procurement controls for AUTOPS.">
    <section style={{ ...ui.card, marginBottom: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 13, background: "#eef0ff", color: "#4659d9" }}><Users size={23} /></span><div><h2 style={{ margin: "0 0 6px", fontSize: 18 }}>Workspace access</h2><p style={{ margin: 0, color: "#718098" }}>Login is disabled. Workspace pages are directly accessible.</p></div></div><p style={{ fontSize: 12, color: "#a12b25", lineHeight: 1.6, marginBottom: 0 }}>Security note: do not store sensitive or confidential data while public access is enabled.</p></section>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>{actions.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} style={{ ...ui.card, margin: 0, textDecoration: "none", color: "#17233d" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 10, background: "#eef0ff", color: "#4659d9" }}><Icon size={18} /></span><strong>{item.title}</strong></div><p style={{ fontSize: 12, color: "#718098", lineHeight: 1.6, margin: 0 }}>{item.description}</p><p style={{ fontSize: 12, color: "#4659d9", fontWeight: 700, marginBottom: 0 }}>Open page →</p></Link>; })}</div>
  </WorkspaceShell>;
}
