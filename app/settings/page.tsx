"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Check, Save, Settings2 } from "lucide-react";

type CompanySettings = {
  companyName: string;
  legalName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  currency: string;
  sourcingRegions: string;
  quoteValidityDays: string;
  defaultMarkup: string;
  quotationTerms: string;
};

const defaults: CompanySettings = {
  companyName: "",
  legalName: "",
  email: "info@senscoretech.com",
  phone: "",
  website: "https://www.senscoretech.com",
  address: "",
  country: "United Arab Emirates",
  currency: "AED",
  sourcingRegions: "UAE + Overseas",
  quoteValidityDays: "30",
  defaultMarkup: "0",
  quotationTerms: "Prices are subject to final confirmation of availability, delivery and applicable taxes. This quotation is valid for the period stated above.",
};

const fields: { key: keyof CompanySettings; label: string; placeholder?: string; type?: string }[] = [
  { key: "companyName", label: "Company name *", placeholder: "Enter the company name" },
  { key: "legalName", label: "Registered legal name", placeholder: "Legal name on invoices and contracts" },
  { key: "email", label: "Business email", placeholder: "name@company.com", type: "email" },
  { key: "phone", label: "Business phone", placeholder: "+971 ..." },
  { key: "website", label: "Website", placeholder: "https://..." },
  { key: "address", label: "Business address", placeholder: "Street, city, emirate / state" },
];

export default function SettingsPage() {
  const [form, setForm] = useState<CompanySettings>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("autops-company-settings");
      if (stored) setForm({ ...defaults, ...JSON.parse(stored) });
    } catch {
      // Ignore invalid browser-stored settings and keep safe defaults.
    }
  }, []);

  function update(key: keyof CompanySettings, value: string) {
    setForm(current => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.companyName.trim()) return;
    window.localStorage.setItem("autops-company-settings", JSON.stringify(form));
    setSaved(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", marginTop: 7, border: "1px solid #dbe3ef",
    borderRadius: 9, padding: "12px 13px", background: "#fff", color: "#17233d", fontSize: 14,
    outlineColor: "#536dfe",
  };
  const labelStyle: React.CSSProperties = { display: "block", color: "#34415b", fontSize: 13, fontWeight: 650 };
  const sectionStyle: React.CSSProperties = { background: "#fff", border: "1px solid #e4eaf2", borderRadius: 15, padding: 22, marginBottom: 18 };

  return (
    <main style={{ minHeight: "100vh", background: "#f5f7fb", color: "#17233d", padding: "28px clamp(16px, 4vw, 54px)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <button onClick={() => { window.location.href = "/"; }} style={{ border: 0, background: "transparent", color: "#56647c", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0 22px", fontSize: 14 }}>
          <ArrowLeft size={16}/> Back to AUTOPS
        </button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 26 }}>
          <div style={{ background: "#e9edff", color: "#4659d9", padding: 13, borderRadius: 13 }}><Building2 size={24}/></div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.6, color: "#5367e8", fontWeight: 750 }}>WORKSPACE CONFIGURATION</div>
            <h1 style={{ fontSize: 30, margin: "7px 0", letterSpacing: -0.8 }}>Company settings</h1>
            <p style={{ color: "#6b7890", margin: 0, lineHeight: 1.6 }}>Set the company identity and commercial defaults used by AUTOPS documents.</p>
          </div>
        </div>

        <form onSubmit={saveSettings}>
          <section style={sectionStyle}>
            <h2 style={{ margin: "0 0 5px", fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}><Building2 size={18}/> Company profile</h2>
            <p style={{ color: "#748098", fontSize: 13, margin: "0 0 20px" }}>Enter or change these details whenever your company information changes.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
              {fields.map(field => <label key={field.key} style={labelStyle}>{field.label}<input required={field.key === "companyName"} type={field.type ?? "text"} value={form[field.key]} placeholder={field.placeholder} onChange={e => update(field.key, e.target.value)} style={inputStyle}/></label>)}
              <label style={labelStyle}>Country<select value={form.country} onChange={e => update("country", e.target.value)} style={inputStyle}><option>United Arab Emirates</option><option>India</option><option>Saudi Arabia</option><option>Qatar</option><option>Oman</option><option>Bahrain</option><option>Other</option></select></label>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ margin: "0 0 5px", fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}><Settings2 size={18}/> Procurement & quotation defaults</h2>
            <p style={{ color: "#748098", fontSize: 13, margin: "0 0 20px" }}>These defaults can be adjusted for individual opportunities and quotations later.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
              <label style={labelStyle}>Default currency<select value={form.currency} onChange={e => update("currency", e.target.value)} style={inputStyle}><option value="AED">AED — UAE dirham</option><option value="USD">USD — US dollar</option><option value="INR">INR — Indian rupee</option><option value="EUR">EUR — euro</option><option value="SAR">SAR — Saudi riyal</option><option value="QAR">QAR — Qatari riyal</option></select></label>
              <label style={labelStyle}>Default supplier sourcing region<select value={form.sourcingRegions} onChange={e => update("sourcingRegions", e.target.value)} style={inputStyle}><option>Inside UAE</option><option>Overseas</option><option>UAE + Overseas</option></select></label>
              <label style={labelStyle}>Default quote validity (days)<input type="number" min="1" max="365" value={form.quoteValidityDays} onChange={e => update("quoteValidityDays", e.target.value)} style={inputStyle}/></label>
              <label style={labelStyle}>Default markup (%)<input type="number" min="0" max="1000" step="0.1" value={form.defaultMarkup} onChange={e => update("defaultMarkup", e.target.value)} style={inputStyle}/></label>
            </div>
            <label style={{ ...labelStyle, marginTop: 18 }}>Standard quotation terms<textarea rows={4} value={form.quotationTerms} onChange={e => update("quotationTerms", e.target.value)} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}/></label>
          </section>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 30 }}>
            <p style={{ color: "#7b879b", fontSize: 12, lineHeight: 1.6, maxWidth: 560, margin: 0 }}>Setup note: this first settings screen saves in this browser only. Cloud-wide persistence and use in generated documents require the next Supabase/authentication integration step.</p>
            <button type="submit" disabled={!form.companyName.trim()} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#4659d9", color: "white", border: 0, borderRadius: 10, padding: "12px 18px", fontWeight: 700, cursor: "pointer", opacity: form.companyName.trim() ? 1 : 0.55 }}>
              {saved ? <Check size={17}/> : <Save size={17}/>} {saved ? "Settings saved" : "Save company settings"}
            </button>
          </div>
          {saved && <div role="status" style={{ background: "#e9f8f0", color: "#176d48", border: "1px solid #c7eed9", padding: "12px 14px", borderRadius: 10, marginBottom: 20, fontSize: 14 }}>Company settings saved in this browser. You can return here to edit them.</div>}
        </form>
      </div>
    </main>
  );
}
