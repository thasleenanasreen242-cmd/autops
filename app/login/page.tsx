"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"Arial,sans-serif",color:"#17233d"}}><p>Login is disabled. Opening AUTOPS…</p></main>;
}
