"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "new" | "revise" | "mastered";
type Filter = "all" | Status;

type Q = {
  id: string;
  question: string;
  answer: string | null;
  company: string | null;
  role: string | null;
  status: Status;
  best_score: number | null;
  attempts: number;
  created_at: string;
};

type Feedback = { score: number; feedback: string; stronger: string };

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "revise", label: "Needs revision" },
  { id: "new", label: "New" },
  { id: "mastered", label: "Mastered" },
];

const STATUS_TEXT: Record<Status, string> = {
  new: "New",
  revise: "Needs revision",
  mastered: "Mastered",
};

const inputClass =
  "w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink " +
  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function statusColor(s: Status) {
  if (s === "mastered") return "text-accent";
  if (s === "revise") return "text-amber-700";
  return "text-muted";
}

export default function QuestionHistory({ userId }: { userId: string }) {
  const [items, setItems] = useState<Q[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("saved_questions")
      .select("id, question, answer, company, role, status, best_score, attempts, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error: loadError }) => {
        if (loadError) setError(loadError.message);
        else setItems((data ?? []) as Q[]);
      });
  }, [userId]);

  async function patch(id: string, changes: Partial<Q>) {
    const { error: updateError } = await supabase
      .from("saved_questions")
      .update(changes)
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setItems((prev) =>
      (prev ?? []).map((q) => (q.id === id ? { ...q, ...changes } : q))
    );
  }

  async function remove(id: string) {
    const { error: deleteError } = await supabase
      .from("saved_questions")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setItems((prev) => (prev ?? []).filter((q) => q.id !== id));
  }

  async function check(q: Q) {
    if (draft.trim().length < 20) {
      setError("Please write a longer answer (at least a couple of sentences).");
      return;
    }
    setError("");
    setBusyId(q.id);
    try {
      const res = await fetch("/api/question-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          answer: draft,
          role: q.role ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");

      const result = data as Feedback;
      setFeedback((prev) => ({ ...prev, [q.id]: result }));
      await patch(q.id, {
        best_score: Math.max(q.best_score ?? 0, result.score),
        attempts: q.attempts + 1,
        status: result.score >= 7 ? "mastered" : "revise",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  if (!items && !error) return <p className="text-sm text-muted">Loading your history...</p>;

  const list = items ?? [];
  const count = (f: Filter) =>
    f === "all" ? list.length : list.filter((q) => q.status === f).length;
  const shown = filter === "all" ? list : list.filter((q) => q.status === filter);

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold">History</h2>
      <p className="mt-1 text-sm text-muted">
        Every question you answered is saved here. Practise the ones that went
        badly until they become Mastered.
      </p>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={
              "rounded-full border px-3 py-1 text-xs transition-colors " +
              (filter === f.id
                ? "border-accent bg-accent text-white"
                : "border-line bg-surface text-muted hover:text-ink")
            }
          >
            {f.label} ({count(f.id)})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {list.length === 0
            ? "Nothing saved yet. Finish an interview and your questions will appear here."
            : "No questions in this group."}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {shown.map((q) => {
            const open = openId === q.id;
            const fb = feedback[q.id];
            return (
              <div key={q.id} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="text-muted">
                    {q.role ?? "Interview"} at {q.company ?? "Company"} | {shortDate(q.created_at)}
                  </p>
                  <p className={"font-medium " + statusColor(q.status)}>
                    {STATUS_TEXT[q.status]}
                    {q.best_score !== null && ` | best ${q.best_score}/10`}
                    {q.attempts > 0 && ` | ${q.attempts} retr${q.attempts === 1 ? "y" : "ies"}`}
                  </p>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-relaxed">
                  {q.question}
                </p>

                {q.answer && (
                  <div className="mt-3 border-l-2 border-line pl-3 text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ink">Your earlier answer: </span>
                    {q.answer}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setOpenId(open ? null : q.id);
                      setDraft("");
                      setError("");
                    }}
                    className="rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accentDark"
                  >
                    {open ? "Close" : "Practise again"}
                  </button>
                  {q.status !== "revise" && (
                    <button
                      onClick={() => patch(q.id, { status: "revise" })}
                      className="text-xs text-muted hover:text-ink"
                    >
                      Mark for revision
                    </button>
                  )}
                  {q.status !== "mastered" && (
                    <button
                      onClick={() => patch(q.id, { status: "mastered" })}
                      className="text-xs text-muted hover:text-ink"
                    >
                      Mark mastered
                    </button>
                  )}
                  <button
                    onClick={() => remove(q.id)}
                    className="ml-auto text-xs text-muted hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                {open && (
                  <div className="mt-4 space-y-3">
                    <textarea
                      rows={5}
                      className={inputClass}
                      placeholder="Write a fresh answer to this question..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button
                      onClick={() => check(q)}
                      disabled={busyId === q.id}
                      className="rounded-md bg-strong px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {busyId === q.id ? "Checking..." : "Get feedback"}
                    </button>

                    {fb && (
                      <div className="rounded-md border border-line p-4 text-sm leading-relaxed">
                        <p className="text-lg font-semibold text-accent">
                          {fb.score}/10
                          <span className="ml-2 text-xs font-normal text-muted">
                            {fb.score >= 7 ? "Marked as Mastered" : "Keep practising"}
                          </span>
                        </p>
                        <p className="mt-2">{fb.feedback}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                          A stronger answer could look like this
                        </p>
                        <p className="mt-1 text-muted">{fb.stronger}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}