"use client";

import { useState } from "react";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[8px] flex items-center justify-center bg-accent mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to PhishGuard</h1>
          <p className="text-sm text-muted mt-1">Explainable phishing detection</p>
        </div>

        <div className="bg-card border border-card-border rounded-[8px] p-6">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="label-text">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-card-border rounded-[6px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-muted-foreground transition-colors"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-card-border rounded-[6px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-muted-foreground transition-colors"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-[6px] hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors mt-2"
            >
              Sign in
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-card-border">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Enterprise SSO
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo screen — not wired to real authentication
        </p>
      </div>
    </div>
  );
}