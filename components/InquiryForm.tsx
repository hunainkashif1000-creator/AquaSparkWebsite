"use client";

import { FormEvent, useState } from "react";

export default function InquiryForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          city: formData.get("city"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSent(true);
      form.reset();
    } catch {
      setError("We couldn't send your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-white/10 p-8 text-white">
        <p className="font-display text-xl font-semibold">Got it — thank you.</p>
        <p className="mt-2 text-white/75">
          Your inquiry is noted. We&apos;ll get back to you shortly to sort out
          a bottle for you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white/10 p-8 backdrop-blur-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-white/70">Your name</span>
          <input
            required
            type="text"
            name="name"
            className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-lemon focus:outline-none"
            placeholder="Ayesha Khan"
          />
        </label>
        <label className="text-sm">
          <span className="text-white/70">City</span>
          <input
            required
            type="text"
            name="city"
            className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-lemon focus:outline-none"
            placeholder="Karachi"
          />
        </label>
      </div>
      <label className="mt-5 block text-sm">
        <span className="text-white/70">WhatsApp or phone number</span>
        <input
          required
          type="tel"
          name="phone"
          className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-lemon focus:outline-none"
          placeholder="03xx-xxxxxxx"
        />
      </label>
      <label className="mt-5 block text-sm">
        <span className="text-white/70">
          How many bottles are you looking for?
        </span>
        <textarea
          name="message"
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-lemon focus:outline-none"
          placeholder="1 bottle for home, or a case for my shop..."
        />
      </label>
      <button
        disabled={isSubmitting}
        type="submit"
        className="mt-6 w-full rounded-full bg-lemon px-7 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>
      {error ? <p className="mt-4 text-sm text-lemon">{error}</p> : null}
    </form>
  );
}
