import React from "react";
import { Rocket } from "lucide-react";

export default function ComingSoonOverlay() {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-xl rounded-3xl border border-border/70 bg-card/95 p-8 md:p-10 text-center shadow-2xl shadow-primary/10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Rocket className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Coming Soon
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          The portfolio is temporarily offline for updates. Please check back soon.
        </p>
      </div>
    </div>
  );
}
