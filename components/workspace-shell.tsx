"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { Activity, Building2, ClipboardList, FileCheck2, FileText, GitCompareArrows, Inbox, LogOut, PackageSearch, Settings, Workflow } from "lucide-react";

const links = [
  { href: "/", label: "Overview", icon: Activity },
  { href: "/leads", label: "Lead register", icon: ClipboardList },
  { href: "/suppliers", label: "Suppliers", icon: PackageSearch },
  { href: "/rfqs", label: "RFQ preparation", icon: FileText },
  { href: "/responses", label: "Supplier responses", icon: Inbox },
  { href: "/comparison", label: "Quote comparison", icon: GitCompareArrows },
  { href: "/quotes", label: "Final quotes", icon: FileCheck2 },
  { href: "/settings", label: "Company settings", icon: Settings },
];
export function WorkspaceShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
 const pathname=usePathname(); const router=useRouter(); const [email,setEmail]=useState(""); const [checking,setChecking]=useState(true); const [error,setError]=useState("");
 useEffect(()=>{let alive=true;(async()=>{try{const sb=createClient();const {data,error}=await sb.auth.getUser();if(error)throw error;if(!data.user){router.replace("/login");return;}if(alive)setEmail(data.user.email??"AUTOPS user");}catch(e){if(alive)setError(e instanceof Error?e.message:"Unable to verify your session.");}finally{if(alive)setChecking(false)}})();return()=>{alive=false}},[router]);
 async function signOut(){try{const sb=createClient();await sb.auth.signOut();router.replace("/login");router.refresh()}catch(e){setError(e instanceof Error?e.message:"Sign out failed.")}}
 const input:React.CSSProperties={width:"100%",padding:"11px 12px",border:"1px solid #dbe3ef",borderRadius:9,background:"#fff",color:"#17233d",font:"inherit",boxSizing:"border-box"};
 return <div style={{minHeight:"100vh",background:"#f5f7fb",color:"#17233d",fontFamily:"Arial,sans-serif",display:"grid",gridTemplateColumns:"230px minmax(0,1fr)"}}>
 <aside style={{background:"#fff",borderRight:"1px solid #e4eaf2",padding:"22px 13px",display:"flex",flexDirection:"column",gap:7}}>
 <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",color:"#17233d",padding:"4px 8px 23px"}}><span style={{background:"#4659d9",color:"#fff,width:37,height:37,borderRadius:11,display:"grid",placeItems:"center"}}><Workflow size={20}/></span><span><b style={{fontSize:19,letterSpacing:1}}>AUTOPS</b><small style={{display:"block",fontSize:9,letterSpacing:1.2,color:"#77849a",marginTop:3}}>PROCUREMENT OPS</small></span></Link>
 <div style={{fontSize:10,letterSpacing:1.2,color:"#99a3b4",fontWeight:700,padding:"6px 10px"}}>WORKSPACE</div>
 {links.map(item=>{const Icon=item.icon;const active=pathname===item.href;return <Link key={item.href} href={item.href} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 10px",borderRadius:9,textDecoration:"none",fontSize:12,fontWeight:active?700:600,color:active?"#354bb6":"#68758b",background:active?"#eef0ff":"transparent"}}><Icon size={16}/>{item.label}</Link>})}
 <div style={{marginTop:"auto",borderTop:"1px solid #edf0f5",paddingTop:16}}><div style={{fontSize:11,color:"#68758b",padding:"7px 8px",overflowWrap:"anywhere"}}>{email||"Private workspace"}</div><button onClick={signOut} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:10,border:0,borderRadius:8,background:"#f7f8fc",color:"#596780",cursor:"pointer",fontSize:12}}><LogOut size={15}/> Sign out</button></div>
 </aside>
 <main style={{minWidth:0}}><header style={{background:"#fff",borderBottom:"1px solid #e4eaf2",padding:"22px clamp(16px,3vw,38px)"}}><div style={{fontSize:10,letterSpacing:1.4,color:"#5367e8",fontWeight:800}}>AUTOPS / WORKSPACE</div><h1 style={{fontSize:26,margin:"7px 0",letterSpacing:-.6}}>{title}</h1><p style={{margin:0,color:"#718098",fontSize:13}}>{description}</p></header><div style={{padding:"24px clamp(16px,3vw,38px)",maxWidth:1500,margin:"0 auto"}}>{checking?<p style={{color:"#718098"}}>Checking secure session…</p>:error?<p role="alert" style={{padding:12,background:"#fff1f0",color:"#a12b25",borderRadius:9}}>{error}</p>:children}<footer style={{borderTop:"1px solid #e4eaf2",marginTop:32,paddingTop:15,fontSize:11,color:"#8b96a8"}}>© 2026 AUTOPS · Procurement, connected. <span style={{float:"right"}}>Private workspace</span></footer></div></main>
 <style jsx>{`@media(max-width:760px){div[style*="grid-template-columns: 230px"]{grid-template-columns:1fr!important}aside{position:static!important;border-right:0!important;border-bottom:1px solid #e4eaf2!important}aside>a:first-child{padding-bottom:10px!important}aside>a:not(:first-child){display:inline-flex!important;width:calc(50% - 8px)!important;vertical-align:top!important}aside>div:first-of-type{display:none!important}aside>div:last-child{margin-top:10px!important}main{min-width:0!important}}`}</style>
 </div>
}
export const ui = {
 card:{background:"#fff",border:"1px solid #e4eaf2",borderRadius:14,padding:20,marginBottom:16} as React.CSSProperties,
 grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14} as React.CSSProperties,
 label:{display:"block",fontSize:12,fontWeight:700,color:"#34415b",marginBottom:12} as React.CSSProperties,
 input:{width:"100%",padding:"11px 12px",border:"1px solid #dbe3ef",borderRadius:9,background:"#fff",color:"#17233d",font:"inherit",boxSizing:"border-box",marginTop:6} as React.CSSProperties,
 button:{padding:"10px 14px",background:"#4659d9",border:0,borderRadius:9,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12} as React.CSSProperties,
 secondary:{padding:"10px 14px",background:"#fff",border:"1px solid #dbe3ef",borderRadius:9,color:"#34415b",fontWeight:700,cursor:"pointer",fontSize:12} as React.CSSProperties,
 table:{width:"100%",borderCollapse:"collapse",fontSize:12} as React.CSSProperties,
 th:{textAlign:"left",padding:"11px 10px",background:"#f7f8fc",color:"#718098",fontSize:10,letterSpacing:.6,borderBottom:"1px solid #e4eaf2"} as React.CSSProperties,
 td:{padding:"13px 10px",borderBottom:"1px solid #edf0f5",verticalAlign:"top"} as React.CSSProperties,
 error:{padding:12,borderRadius:9,background:"#fff1f0",color:"#a12b25",fontSize:12} as React.CSSProperties,
 success:{padding:12,borderRadius:9,background:"#eaf8f1",color:"#18734f",fontSize:12} as React.CSSProperties,
};