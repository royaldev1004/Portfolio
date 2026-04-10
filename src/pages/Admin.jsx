import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";

function SetupInstructions() {
  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        <p className="font-heading font-semibold text-foreground text-base">Supabase not configured</p>
        <p>Add these to <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code> and run <code className="text-xs bg-muted px-1 py-0.5 rounded">supabase/schema.sql</code> in your Supabase SQL Editor:</p>
        <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
VITE_SUPABASE_URL=https://xxxx.supabase.co{"\n"}VITE_SUPABASE_ANON_KEY=your_anon_key
        </pre>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Signed in");
  };

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        <div>
          <p className="font-mono text-xs uppercase text-primary tracking-[0.2em] mb-2">Admin Panel</p>
          <h1 className="font-heading font-semibold text-2xl text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Use the Supabase user you created for this project.</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-widest">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              autoComplete="email" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              autoComplete="current-password" required />
          </div>
          <button type="submit" disabled={busy}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) { setAuthReady(true); return; }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isSupabaseConfigured()) return <SetupInstructions />;
  if (!session) return <LoginForm />;
  return <AdminLayout session={session} />;
}
