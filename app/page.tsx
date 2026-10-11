"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import AuthBox from "@/components/AuthBox";
import Landing from "@/components/Landing";
import InterviewSimulator from "@/components/InterviewSimulator";
import TeamScenario from "@/components/TeamScenario";
import ProgressDashboard from "@/components/ProgressDashboard";
import QuestionHistory from "@/components/QuestionHistory";
import ResumeCheck from "@/components/ResumeCheck";
import VisionBoard from "@/components/VisionBoard";
import Overview from "@/components/Overview";
import Sidebar from "@/components/Sidebar";
import type { View } from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  // Signed out: introduction page and sign-in
  if (!session) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-line bg-side">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <button
              onClick={() => setShowAuth(false)}
              className="flex items-center gap-3 font-brand text-2xl tracking-tight"
            >
              <img
                src="/verve-logo.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              Verve
            </button>
            <div className="flex items-center gap-4">
              <div className="w-44">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark"
              >
                Sign in / Sign up
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">
          {showAuth ? <AuthBox /> : <Landing onStart={() => setShowAuth(true)} />}
        </main>
      </div>
    );
  }

  // Signed in: sidebar layout
  return (
    <div className="min-h-screen">
      <Sidebar
        view={view}
        onChange={setView}
        email={session.user.email ?? "You"}
        onSignOut={() => supabase.auth.signOut()}
      />
      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {view === "overview" && (
            <Overview
              userId={session.user.id}
              email={session.user.email ?? "You"}
              onNavigate={setView}
            />
          )}
          <div className={view === "interview" ? "" : "hidden"}>
            <InterviewSimulator userId={session.user.id} />
          </div>
          <div className={view === "team" ? "" : "hidden"}>
            <TeamScenario userId={session.user.id} />
          </div>
          {view === "progress" && <ProgressDashboard userId={session.user.id} />}
          {view === "history" && <QuestionHistory userId={session.user.id} />}
          {view === "resume" && <ResumeCheck />}
          {view === "vision" && <VisionBoard userId={session.user.id} />}
        </div>
      </main>
    </div>
  );
}