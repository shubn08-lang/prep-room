export type Level = "intern" | "junior" | "mid" | "senior";

export const LEVELS: {
  value: Level;
  title: string;
  text: string;
  guide: string;
}[] = [
  {
    value: "intern",
    title: "Intern / Fresher",
    text: "Basics, learning attitude, projects.",
    guide:
      "Ask basic, friendly questions about fundamentals, college projects, curiosity and willingness to learn. Do not expect work experience. Keep difficulty low to medium.",
  },
  {
    value: "junior",
    title: "Junior (0-2 years)",
    text: "Core skills and first real work.",
    guide:
      "Ask about core skills, one or two real projects, how they handle feedback and deadlines, and simple problem solving. Difficulty is medium.",
  },
  {
    value: "mid",
    title: "Mid level (3-5 years)",
    text: "Ownership and trade-offs.",
    guide:
      "Ask about ownership of features, trade-offs, working with other teams, handling mistakes and mentoring juniors. Difficulty is medium to high. Ask follow-ups that need specific examples.",
  },
  {
    value: "senior",
    title: "Senior (6+ years)",
    text: "Leadership and big decisions.",
    guide:
      "Ask about leading people and projects, hard decisions with incomplete information, influencing without authority and business impact. Difficulty is high. Expect structured, confident answers.",
  },
];

// General focus areas for well-known companies. These are not live news.
export const COMPANIES: { name: string; focus: string }[] = [
  { name: "Google", focus: "Structured problem solving, thinking aloud, strong fundamentals, comfort with ambiguity and teamwork." },
  { name: "Microsoft", focus: "Growth mindset, collaboration, clear technical communication, customer focus, cloud and AI products." },
  { name: "Amazon", focus: "Leadership principles such as customer obsession and ownership. Behaviour stories with measurable results, bias for action and frugality." },
  { name: "Meta", focus: "Moving fast, impact at scale, product sense and shipping quickly." },
  { name: "Apple", focus: "Attention to detail, craftsmanship, privacy, and a high bar for user experience." },
  { name: "Netflix", focus: "Freedom and responsibility, candid feedback, high performance and good judgement." },
  { name: "Adobe", focus: "Creativity, product design, customer experience and AI-powered creative tools." },
  { name: "Salesforce", focus: "Customer success, trust, cloud software and teamwork." },
  { name: "Flipkart", focus: "E-commerce at scale, handling sale-day traffic, supply chain and customer experience in India." },
  { name: "Swiggy", focus: "Fast delivery, operations at peak load, data-driven decisions and customer experience." },
  { name: "Zomato", focus: "Fast delivery, operations at peak load, data-driven decisions and customer experience." },
  { name: "TCS", focus: "Client-facing delivery, process discipline, communication and adapting to new technologies." },
  { name: "Infosys", focus: "Client-facing delivery, process discipline, communication and adapting to new technologies." },
  { name: "Wipro", focus: "Client-facing delivery, teamwork across time zones and learning new tools quickly." },
  { name: "Accenture", focus: "Consulting mindset, client communication, adaptability and teamwork." },
];

export function companyFocus(name: string) {
  const key = name.trim().toLowerCase();
  return COMPANIES.find((c) => c.name.toLowerCase() === key)?.focus ?? "";
}