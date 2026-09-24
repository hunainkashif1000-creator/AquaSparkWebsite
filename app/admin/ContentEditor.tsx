"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Image = { src: string; alt: string; width: number; height: number };
type Product = { id: string; order: number; name: string; size?: string; description?: string; image: Image };
type Deal = { id: string; order: number; text: string; active: boolean };
type Settings = { id: string; hero: { eyebrow: string; title: string; body: string; primaryCta: string; secondaryCta: string; trustItems: string[][]; video?: string; poster?: string }; productSection: { eyebrow: string; title: string; body: string }; howToUse: { eyebrow: string; title: string }; whereToBuy: { eyebrow: string; title: string; body: string; details: string[][] }; footer: { tagline: string }; navigation: { contactCta: string } };
type TextItem = { id: string; order: number; n: string; title: string; body: string };
type Content = { navigationLinks: { id: string; order: number; href: string; label: string }[]; featureRows: (TextItem & { icon: string; tint: string; eyebrow: string })[]; usageSteps: TextItem[]; products: Product[]; productCallouts: (TextItem & { top: string; left: string })[]; tickerDeals: Deal[]; siteSettings: Settings[] };

const classes = "mt-1.5 w-full rounded-xl border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus:border-lime focus:ring-2 focus:ring-lime/15";
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function Field({ label, value, change, area = false }: { label: string; value: string; change: (value: string) => void; area?: boolean }) {
  return <label className="block text-sm font-medium text-ink/75"><span>{label}</span>{area ? <textarea rows={3} className={classes} value={value} onChange={(event) => change(event.target.value)} /> : <input className={classes} value={value} onChange={(event) => change(event.target.value)} />}</label>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7"><h2 className="mb-5 font-display text-2xl font-semibold text-ink">{title}</h2>{children}</section>;
}

function MediaField({ label, value, accept, change }: { label: string; value: string; accept: string; change: (value: string) => void }) {
  const [state, setState] = useState("");
  async function upload(file: File) {
    setState("Uploading…");
    try {
      const form = new FormData(); form.append("file", file);
      if (typeof value === "string" && value.startsWith("/api/uploads/")) form.append("current", value);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      let result: { url?: string; error?: string } = {};
      try { result = await response.json() as { url?: string; error?: string }; } catch { /* non-JSON platform error page */ }
      if (!response.ok || !result.url) throw new Error(result.error || `Upload failed (HTTP ${response.status}).`);
      change(result.url); setState("Uploaded.");
    } catch (error) { setState(error instanceof Error && error.message ? error.message : "Upload failed."); }
  }
  return <div className="rounded-2xl border border-ink/10 bg-cream p-3"><Field label={`${label} URL or path`} value={value} change={change} /><label className="mt-3 block cursor-pointer rounded-xl border border-dashed border-ink/25 bg-white px-3 py-2 text-center text-sm font-semibold text-ink">{state === "Uploading…" ? state : `Upload ${label.toLowerCase()}`}<input className="sr-only" type="file" accept={accept} disabled={state === "Uploading…"} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /></label>{state && <p className="mt-2 text-xs text-ink/65">{state}</p>}</div>;
}

export default function ContentEditor() {
  const [content, setContent] = useState<Content | null>(null);
  const [status, setStatus] = useState("Loading website settings…");
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetch("/api/admin/content").then(async (r) => { if (!r.ok) throw new Error(); return r.json() as Promise<Content>; }).then((data) => { setContent(data); setStatus("Edit then press Save changes."); }).catch(() => setStatus("Could not load content. Check MongoDB and try again.")); }, []);
  const edit = (next: Content) => { setContent(next); setStatus("Unsaved changes"); };
  async function save() {
    if (!content) return; setSaving(true); setStatus("Saving changes…");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      let result: { success?: boolean; error?: string } = {};
      try { result = await response.json() as { success?: boolean; error?: string }; } catch { /* non-JSON platform error page */ }
      if (!response.ok || result.success !== true) throw new Error(result.error || `Save failed (HTTP ${response.status}). The database may be unreachable from Vercel.`);
      setStatus("Saved. Changes appear on the next website visit.");
    } catch (error) { setStatus(error instanceof Error && error.message ? error.message : "Save failed. See the Vercel function logs."); } finally { setSaving(false); }
  }
  if (!content) return <main className="grid min-h-screen place-items-center bg-cream p-6 text-ink">{status}</main>;
  const settings = content.siteSettings[0];
  const hero = (key: keyof Settings["hero"], value: string) => edit({ ...content, siteSettings: [{ ...settings, hero: { ...settings.hero, [key]: value } }] });
  const statusError = /could not|fail|error|missing|unreachable|HTTP \d/i.test(status);
  const statusClass = statusError ? "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" : "rounded-2xl border border-lime/20 bg-lime/10 px-4 py-3 text-sm text-ink";
  return <main className="min-h-screen bg-cream pb-28"><header className="border-b border-ink/10 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5"><div><p className="font-display text-sm font-semibold text-lime-deep">Aqua Spark</p><h1 className="font-display text-3xl font-semibold text-ink">Website settings</h1></div><Link href="/" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink">View website</Link></div></header><div className="mx-auto max-w-7xl space-y-7 px-5 py-8"><div className={statusClass}>{status}</div>
    <Panel title="Change hero video and image"><p className="mb-4 text-sm text-ink/60">Upload an MP4/WebM video and its poster image. You can also paste a URL or public-file path.</p><div className="grid gap-4 md:grid-cols-2"><MediaField label="Hero video" value={settings.hero.video ?? "/video/hero-web.mp4"} accept="video/mp4,video/webm" change={(value) => hero("video", value)} /><MediaField label="Hero poster image" value={settings.hero.poster ?? "/images/hero-poster.jpg"} accept="image/jpeg,image/png,image/webp,image/gif,image/avif" change={(value) => hero("poster", value)} /></div></Panel>
    <Panel title="Hero text"><div className="grid gap-4 md:grid-cols-2"><Field label="Small heading" value={settings.hero.eyebrow} change={(value) => hero("eyebrow", value)} /><Field label="Main heading" value={settings.hero.title} change={(value) => hero("title", value)} /><div className="md:col-span-2"><Field label="Description" value={settings.hero.body} change={(value) => hero("body", value)} area /></div><Field label="First button" value={settings.hero.primaryCta} change={(value) => hero("primaryCta", value)} /><Field label="Second button" value={settings.hero.secondaryCta} change={(value) => hero("secondaryCta", value)} /></div></Panel>
    <Panel title="Deals and announcement ticker"><p className="mb-4 text-sm text-ink/60">These messages scroll directly under the hero. Use them for sales, new launches, or any future deal.</p><div className="space-y-3">{content.tickerDeals.map((deal, index) => <div key={deal.id} className="grid gap-3 rounded-2xl bg-cream p-4 md:grid-cols-[1fr_auto_auto]"><Field label="Message" value={deal.text} change={(value) => edit({ ...content, tickerDeals: content.tickerDeals.map((item, i) => i === index ? { ...item, text: value } : item) })} /><label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold"><input type="checkbox" checked={deal.active} onChange={(event) => edit({ ...content, tickerDeals: content.tickerDeals.map((item, i) => i === index ? { ...item, active: event.target.checked } : item) })} /> Show</label><button type="button" onClick={() => edit({ ...content, tickerDeals: content.tickerDeals.filter((_, i) => i !== index) })} className="self-end rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Remove</button></div>)}</div><button type="button" onClick={() => edit({ ...content, tickerDeals: [...content.tickerDeals, { id: id("deal"), order: content.tickerDeals.length + 1, text: "New offer", active: true }] })} className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Add deal or announcement</button></Panel>
    <Panel title="Products and bottle sizes"><p className="mb-4 text-sm text-ink/60">Add a 500ml, 800ml, or any future product. Extra products appear as available sizes on the website.</p><div className="space-y-5">{content.products.map((product, index) => <article key={product.id} className="rounded-2xl bg-cream p-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Product name" value={product.name} change={(value) => edit({ ...content, products: content.products.map((item, i) => i === index ? { ...item, name: value } : item) })} /><Field label="Bottle size" value={product.size ?? ""} change={(value) => edit({ ...content, products: content.products.map((item, i) => i === index ? { ...item, size: value } : item) })} /><div className="md:col-span-2"><Field label="Short description" value={product.description ?? ""} area change={(value) => edit({ ...content, products: content.products.map((item, i) => i === index ? { ...item, description: value } : item) })} /></div><MediaField label="Product image" value={product.image.src} accept="image/jpeg,image/png,image/webp,image/gif,image/avif" change={(value) => edit({ ...content, products: content.products.map((item, i) => i === index ? { ...item, image: { ...item.image, src: value } } : item) })} /><Field label="Image description" value={product.image.alt} change={(value) => edit({ ...content, products: content.products.map((item, i) => i === index ? { ...item, image: { ...item.image, alt: value } } : item) })} /></div><button type="button" disabled={content.products.length === 1} onClick={() => edit({ ...content, products: content.products.filter((_, i) => i !== index) })} className="mt-4 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-40">Remove product</button></article>)}</div><button type="button" onClick={() => edit({ ...content, products: [...content.products, { id: id("product"), order: content.products.length + 1, name: "Aqua Spark", size: "500ml", description: "", image: { src: "/images/bottle-photo.jpeg", alt: "Aqua Spark bottle", width: 520, height: 876 } }] })} className="mt-4 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-white">Add a product</button></Panel>
    <Panel title="Quick site text"><div className="grid gap-4 md:grid-cols-2"><Field label="Product section heading" value={settings.productSection.title} change={(value) => edit({ ...content, siteSettings: [{ ...settings, productSection: { ...settings.productSection, title: value } }] })} /><Field label="Contact button" value={settings.navigation.contactCta} change={(value) => edit({ ...content, siteSettings: [{ ...settings, navigation: { contactCta: value } }] })} /><div className="md:col-span-2"><Field label="Product section description" value={settings.productSection.body} area change={(value) => edit({ ...content, siteSettings: [{ ...settings, productSection: { ...settings.productSection, body: value } }] })} /></div></div></Panel>
  </div><div className="fixed inset-x-0 bottom-0 border-t border-ink/10 bg-white/95 px-5 py-4 backdrop-blur"><div className="mx-auto flex max-w-7xl justify-end"><button type="button" onClick={save} disabled={saving} className="rounded-full bg-lime px-7 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div></div></main>;
}
