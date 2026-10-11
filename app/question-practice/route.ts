import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Use the same model name as in your other routes.
const MODEL = "openai/gpt-oss-120b";

type Raw = Record<string, unknown>;

const asString = (v: unknown) => (typeof v === "string" ? v : "");
const clamp = (v: unknown, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(Number(v) || 0)));

function safeJson(text: string): Raw {
  try {
    return JSON.parse(text) as Raw;
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "The server is missing GROQ_API_KEY." },
      { status: 500 }
    );
  }

  let body: Raw;
  try {
    body = (await req.json()) as Raw;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const question = asString(body.question).trim().slice(0, 1500);
  const answer = asString(body.answer).trim().slice(0, 3000);
  const role = asString(body.role).trim().slice(0, 120);

  if (!question) {
    return NextResponse.json({ error: "Missing question." }, { status: 400 });
  }
  if (answer.length < 20) {
    return NextResponse.json(
      { error: "Please write a longer answer first." },
      { status: 400 }
    );
  }

  const system = [
    `You are a fair, encouraging interview coach. Score one answer to one interview question${role ? ` for this role: ${role}` : ""}.`,
    `Score from 0 to 10 on clarity, relevance to the question, specific examples and structure. Judge only what is written. Never guess or mention the person's name, age, gender, nationality or background.`,
    `"feedback" is 2 or 3 sentences: what worked and what is missing. "stronger" is a short outline (3 or 4 sentences) of how a stronger answer could be structured. NEVER invent facts about the candidate. Where a personal detail is needed, use a placeholder such as [your project] or [a result you achieved].`,
    `Reply ONLY with JSON in exactly this shape: {"score": number, "feedback": string, "stronger": string}`,
  ].join("\n\n");

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Question:\n${question}\n\nCandidate answer:\n${answer}`,
        },
      ],
    });

    const out = safeJson(completion.choices[0]?.message?.content ?? "");
    return NextResponse.json({
      score: clamp(out.score, 0, 10),
      feedback: asString(out.feedback),
      stronger: asString(out.stronger),
    });
  } catch (err) {
    console.error("question-practice error:", err);
    return NextResponse.json(
      { error: "The AI could not check the answer right now. Please try again." },
      { status: 502 }
    );
  }
}