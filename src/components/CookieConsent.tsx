"use client";

import { useEffect, useState } from "react";

const KEY = "rd-cookie-consent";
const OPEN_EVENT = "rd-cookie-settings";

type Choice = "accepted" | "declined";

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readChoice() === null);
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="rise fixed inset-x-4 bottom-4 z-50 rounded-xl border border-hairline bg-surface p-5 shadow-2xl md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md md:p-6"
    >
      <p className="t-ui text-lg text-chalk">Cookies</p>
      <p className="mt-2 text-base leading-normal text-graphite">
        This site only uses what it needs to work. No tracking, analytics or
        advertising cookies.{" "}
        <a href="/privacy" className="text-chalk underline underline-offset-4">
          Privacy
        </a>
      </p>
      <div className="mt-5 flex gap-3">
        <button type="button" onClick={() => decide("accepted")} className="btn btn-solid">
          Accept
        </button>
        <button type="button" onClick={() => decide("declined")} className="btn btn-line">
          Decline
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
