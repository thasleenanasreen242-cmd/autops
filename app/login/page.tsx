"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { Workflow, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) router.replace("/");
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supabase is not configured.");
    }
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f6fb", padding: 20, fontFamily: "Arial, sans-serif", color: "#17233d" }}>
      <section style={{ width: "100%", maxWidth: 420, background: "#fff", border: "1px solid #e4eaf2", borderRadius: 18, padding: 30, boxShadow: "0 16px 45px rgba(20,35,70,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 13, background: "#4659d9", color: "#fff" }}><Workflow size={23}/></span>
          <div><strong style={{ fontSize: 22, letterSpacing: 1 }}>AUTOPS</strong><div style={{ fontSize: 10, letterSpacing: 1.5, color: "#78849a", marginTop: 3 }}>PROCUREMENT OPERATIONS</div></div>
        </div>
        <h1 style={{ fontSize: 25, margin: "0 0 7px" }}>Sign in to your workspace</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#738098", margin: "0 0 24px" }}>Use your AUTOPS administrator account to access company records.</p>
        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 650, marginBottom: 16 }}>Email address
            <input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", boxSizing: "border-box", width: "100%", padding: 12, marginTop: 7, border: "1px solid #dbe3ef", borderRadius: 9, fontSize: 14 }} placeholder="you@company.com"/>
          </label>
          <label style={{ display: "block", fontSize: 13, fontWeight: 650, marginBottom: 18 }}>Password
            <input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", boxSizing: "border-box", width: "100%", padding: 12, marginTop: 7, border: "1px solid #dbe3ef", borderRadius: 9, fontSize: 14 }} placeholder="Enter your password"/>
          </label>
          {error && <p role="alert" style={{ background: "#fff0f0", color: "#a52c37", borderRadius: 8, padding: 11, fontSize: 13, lineHeight: 1.5 }}>{error}</p>}
          <button disabled={loading} type="submit" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#4659d9", color: "#fff", border: 0, borderRadius: 10, padding: 13, fontWeight: 700, cursor: "pointer", opacity: loading ? .7 : 1 }}><LockKeyhole size={16}/>{loading ? "Signing in…" : "Sign in securely"}</button>
        </form>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#8994a7", margin: "18px 0 0" }}>Create the administrator user in Supabase Authentication first. Public sign-up is intentionally not offered on this screen.</p>
      </section>
    </main>
  );
}
