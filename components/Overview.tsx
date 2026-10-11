"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Debrief } from "@/lib/types";
import type { View } from "./Sidebar";

type Row = {
  created_at: string;
  scenario_type: string;
  overall_score: number | null;
  debrief: Debrief | null;
};

type Props = {
  userId: string;
  email: string;
  onNavigate: (v: View) => void;
};

const ACTIONS: { view: View; title: string; text: string }[] = [
  { view: "interview", title: "Start an interview", text: "Pick a role and company, then face the interviewer." },
  { view: "team", title: "Lead a team meeting", text: "Three AI teammates, each with a different personality." },
  { view: "resume", title: "Check your resume", text: "Get a score and better wording." },
  { view: "vision", title: "Update your vision board", text: "Keep your goals and affirmations in view." },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function Overview({ userId, email, onNavigate }: Props) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [goals, setGoals] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [s, g] = await Promise.all([
        supabase
          .from("sessions")
          .select("created_at, scenario_type, overall_score, debrief")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("vision_items")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
      ]);
      if (cancelled) return;
      setRows((s.data ?? []) as Row[]);
      setGoals(g.count ?? 0);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const name = email.split("@")[0];

  if (!rows) return <p className="text-sm text-muted">Loading...</p>;

  const scores = rows
    .map((r) => r.overall_score)
    .filter((v): v is number => typeof v === "number");
  const average = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const best = scores.length ? Math.max(...scores) : null;

  // Weakest skill across all saved debriefs
  const skillMap = new Map<string, { total: number; count: number; tip: string }>();
  for (const r of rows) {
    for (const item of r.debrief?.rubric ?? []) {
      const cur = skillMap.get(item.skill) ?? { total: 0, count: 0, tip: "" };
      cur.total += item.score;
      cur.count += 1;
      if (!cur.tip && item.tip) cur.tip = item.tip;
      skillMap.set(item.skill, cur);
    }
  }
  const skills = Array.from(skillMap, ([skill, v]) => ({
    skill,
    avg: v.total / v.count,
    tip: v.tip,
  }));
  const weakest = skills.length
    ? skills.reduce((a, b) => (b.avg < a.avg ? b : a))
    : null;

  const checklist = [
    { label: "Complete your first interview", done: rows.some((r) => r.scenario_type === "interview") },
    { label: "Lead a team meeting", done: rows.some((r) => r.scenario_type === "team") },
    { label: "Practise at least 3 times", done: rows.length >= 3 },
    { label: "Score 70 or more once", done: (best ?? 0) >= 70 },
    { label: "Add a goal to your vision board", done: goals > 0 },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const strength = Math.round((doneCount / checklist.length) * 100);

  return (
    <section className="mx-auto max-w-4xl">
      <p className="font-greeting text-lg text-muted">{greeting()},</p>
      <h2 className="font-greeting text-4xl tracking-wide">{name}</h2>
      <p className="mt-2 text-sm text-muted">
        Here is where you stand today. Small, regular practice builds confidence.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Sessions", value: String(rows.length) },
          { label: "Average score", value: average === null ? "-" : String(average) },
          { label: "Best score", value: best === null ? "-" : String(best) },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Profile strength
            </h3>
            <p className="text-lg font-semibold text-accent">{strength}%</p>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-line">
            <div className="h-full rounded-full bg-accent" style={{ width: `${strength}%` }} />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-center gap-3">
                <span
                  className={
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] " +
                    (c.done ? "border-accent bg-accent text-white" : "border-line text-transparent")
                  }
                >
                  ✓
                </span>
                <span className={c.done ? "text-muted line-through" : ""}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            What to improve next
          </h3>
          {weakest ? (
            <div className="mt-4 border-l-2 border-accent pl-4">
              <p className="text-sm font-semibold text-accent">{weakest.skill}</p>
              <p className="mt-1 text-xs text-muted">
                Your average here is {weakest.avg.toFixed(1)} out of 10.
              </p>
              {weakest.tip && <p className="mt-2 text-sm leading-relaxed">{weakest.tip}</p>}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Finish one interview and your weakest skill will show up here with
              a tip.
            </p>
          )}
        </div>
      </div>

      <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
        Jump back in
      </h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <button
            key={a.view}
            onClick={() => onNavigate(a.view)}
            className="rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-accent"
          >
            <p className="text-sm font-semibold">{a.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{a.text}</p>
          </button>
        ))}
      </div>
    </section>
  );
}