import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-background">

      {/* Spinning ring stack */}
      <div className="relative flex h-80 w-80 items-center justify-center">
        {/* Faint static ring */}
        <div className="absolute h-full w-full rounded-full border border-primary/15" />

        {/* Outer glow pulse */}
        <div className="absolute h-full w-full animate-ping rounded-full border border-primary/10" />

        {/* Outer spinner */}
        <div className="absolute h-full w-full animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/60"
          style={{ animationDuration: "2s" }} />

        {/* Middle counter-spinner */}
        <div
          className="absolute h-[86%] w-[86%] animate-spin rounded-full border-2 border-transparent border-b-cyan-400/70 border-l-cyan-400/30"
          style={{ animationDirection: "reverse", animationDuration: "3.5s" }}
        />

        {/* Inner static glass disc */}
        <div className="absolute h-[70%] w-[70%] rounded-full bg-card/80 shadow-[0_0_40px_rgba(0,132,255,0.14)] backdrop-blur-md" />

        {/* Text-version logo restored and resized to fit */}
        <img
          src="/loader-crown.png"
          alt="Royal Dev"
          className="relative z-10 w-52 object-contain drop-shadow-[0_0_12px_rgba(0,180,255,0.32)]"
        />
      </div>

      {/* Text below the ring */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Preparing experience
        </p>
        <span className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              style={{
                animation: "bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
