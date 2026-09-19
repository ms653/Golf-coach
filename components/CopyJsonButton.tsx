"use client";

import { useState } from "react";

export default function CopyJsonButton({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = JSON.stringify(value, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; user can still select the text below
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-primary">
      {copied ? "Copied!" : "Copy JSON"}
    </button>
  );
}
