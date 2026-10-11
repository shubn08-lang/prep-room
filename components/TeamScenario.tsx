"use client";

import { useRef, useState, useEffect } from "react";
import { SCENARIOS, TEAM_ROUNDS, getScenario } from "@/lib/teamScenarios";
import type { Mood } from "@/lib/teamScenarios";
import type { Debrief, Mode } from "@/lib/types";

type ChatMsg = { speaker: string; text: string; mood?: Mood };

type Props = { userId?: string };

const MOOD_STYLE: Record<Mood, string> = {
  supportive: "bg-green-500/15 text-green-600",
  neutral: "bg-gray-500/15 text-gray-500",
  frustrated: "bg-red-500/15 text-red-500",
};

export default function TeamScenario(_props: Props) {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("practice");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [coachTip, setCoachTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [debrief, setDebrief] = useState<Debrief | null>(null);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const scenario = scenarioId ? getScenario(scenarioId) : undefined;
  const leaderCount = messages.filter((m) => m.speaker === "You").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function callApi(body: Record<string, unknown>) {
    const res = await fetch("/api/team-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    return data;
  }

  async function runTurn(id: string, history: ChatMsg[]) {
    setLoading(true);
    setError("");
    try {
      const data = await callApi({
        action: "turn",
        scenarioId: id,
        mode,
        messages: history.map((m) => ({ speaker: m.speaker, text: m.text })),
      });
      const replies: ChatMsg[] = (
        data.replies as { speaker: string; message: string; mood: Mood }[]
      ).map((r) => ({ speaker: r.speaker, text: r.message, mood: r.mood }));
      setMessages([...history, ...replies]);
      setCoachTip(data.coachTip || "");
      setFinished(Boolean(data.finished));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function startMeeting(id: string) {
    setScenarioId(id);
    setMessages([]);
    setCoachTip("");
    setFinished(false);
    setDebrief(null);
    setInput("");
    await runTurn(id, []);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading || finished || !scenarioId) return;
    const history = [...messages, { speaker: "You", text }];
    setMessages(history);
    setInput("");
    await runTurn(scenarioId, history);
  }

  async function endMeeting() {
    if (!scenarioId || loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await callApi({
        action: "debrief",
        scenarioId,
        mode,
        messages: messages.map((m) => ({ speaker: m.speaker, text: m.text })),
      });
      setDebrief(data as Debrief);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setScenarioId(null);
    setMessages([]);
    setCoachTip("");
    setFinished(false);
    setDebrief(null);
    setError("");
    setInput("");
  }

  // Screen 1: choose a scenario
  if (!scenario) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team scenarios</h1>
        <p className="mt-2 opacity-70">
          You are the team lead. Run a meeting with your team and get feedback on how you
          led it.
        </p>

        <div className="mt-6 flex gap-2">
          {(["practice", "test"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md border px-4 py-2 text-sm font-medium capitalize ${
                mode === m
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-side"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm opacity-60">
          {mode === "practice"
            ? "Practice shows a coaching tip after each of your messages."
            : "Test hides the tips. You get feedback only at the end."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => startMeeting(s.id)}
              className="rounded-lg border border-line bg-side p-5 text-left hover:border-accent"
            >
              <div className="font-semibold">{s.title}</div>
              <div className="mt-1 text-sm opacity-70">{s.summary}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 3: debrief
  if (debrief) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Debrief: {scenario.title}</h1>
        <div className="mt-4 rounded-lg border border-line bg-side p-5">
          <div className="text-4xl font-semibold">{debrief.overall}/100</div>
          <p className="mt-3">{debrief.summary}</p>
        </div>

        <h2 className="mt-6 text-lg font-semibold">Skills</h2>
        <div className="mt-3 space-y-3">
          {debrief.rubric.map((r) => (
            <div key={r.skill} className="rounded-lg border border-line bg-side p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.skill}</span>
                <span className="font-semibold">{r.score}/10</span>
              </div>
              <p className="mt-2 text-sm opacity-80">Evidence: {r.evidence}</p>
              <p className="mt-1 text-sm">Next time: {r.tip}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-side p-4">
            <h3 className="font-semibold">Strengths</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {debrief.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-side p-4">
            <h3 className="font-semibold">To improve</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {debrief.improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => startMeeting(scenario.id)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark"
          >
            Try this scenario again
          </button>
          <button
            onClick={reset}
            className="rounded-md border border-line bg-side px-4 py-2 text-sm font-medium"
          >
            Choose another scenario
          </button>
        </div>
      </div>
    );
  }

  // Screen 2: the meeting
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{scenario.title}</h1>
          <p className="mt-1 text-sm opacity-60 capitalize">{mode} mode</p>
        </div>
        <button
          onClick={reset}
          className="rounded-md border border-line bg-side px-3 py-1.5 text-sm"
        >
          Leave
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-side p-4 text-sm">
        <p>{scenario.brief}</p>
        <p className="mt-2 font-medium">Your goal: {scenario.goal}</p>
        <p className="mt-2 opacity-70">
          Team: {scenario.teammates.map((t) => `${t.name} (${t.role})`).join(", ")}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {messages.map((m, i) =>
          m.speaker === "You" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-accent px-4 py-2 text-white">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="max-w-[80%] rounded-lg border border-line bg-side px-4 py-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {m.speaker}
                {m.mood && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${MOOD_STYLE[m.mood]}`}>
                    {m.mood}
                  </span>
                )}
              </div>
              <p className="mt-1">{m.text}</p>
            </div>
          )
        )}
        {loading && <p className="text-sm opacity-60">Waiting for the team...</p>}
        <div ref={bottomRef} />
      </div>

      {mode === "practice" && coachTip && (
        <div className="mt-4 rounded-lg border border-accent p-3 text-sm">
          <span className="font-semibold">Coach: </span>
          {coachTip}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-4">
        {!finished ? (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={3}
              placeholder="Write your message to the team"
              className="w-full rounded-md border border-line bg-side p-3"
              disabled={loading}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm opacity-60">
                Message {Math.min(leaderCount + 1, TEAM_ROUNDS)} of {TEAM_ROUNDS}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark disabled:opacity-50"
                >
                  Send
                </button>
                <button
                  onClick={endMeeting}
                  disabled={loading || leaderCount < 1}
                  className="rounded-md border border-line bg-side px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  End meeting and get debrief
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={endMeeting}
            disabled={loading}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark disabled:opacity-50"
          >
            {loading ? "Preparing debrief..." : "Get debrief"}
          </button>
        )}
      </div>
    </div>
  );
}