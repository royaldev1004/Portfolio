import React from "react";
import { useProfile } from "@/lib/useProfile";

export default function Footer() {
  const { name, email } = useProfile();
  return (
    <footer className="px-[7.5vw] py-8 border-t border-border/50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono-caption text-muted-foreground">
          © {new Date().getFullYear()} {name} — All rights reserved
        </p>
        <a
          href={`mailto:${email}`}
          className="font-mono-caption text-muted-foreground hover:text-primary transition-colors"
        >
          {email}
        </a>
      </div>
    </footer>
  );
}
