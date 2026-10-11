
export type Mood = "supportive" | "neutral" | "frustrated";

// How many messages the team lead gets to send in one meeting.
export const TEAM_ROUNDS = 6;

export type Teammate = {
  name: string;
  role: string;
  personality: string;
};

export type Scenario = {
  id: string;
  title: string;
  summary: string;
  brief: string;
  goal: string;
  hiddenFact: string;
  teammates: Teammate[];
};



// END OF FILE


export const SCENARIOS_A: Scenario[] = [
  {
    id: "launch-week",
    title: "Launch week crisis",
    summary: "The launch is in 5 days and a key feature is behind schedule.",
    brief:
      "You have just been made team lead of a four-person app project. The app launches for its first customer in 5 days. The payment feature is two days behind, the customer wants a status update by tomorrow, and the team is tense. You have called a team meeting.",
    goal: "Agree a clear plan with the team that you can tell the customer by tomorrow.",
    hiddenFact:
      "Meera (QA) has found a serious bug in the payment flow that could lose customers' money. She shares it only if the leader asks for her opinion or invites her to speak.",
    teammates: [
      {
        name: "Riya",
        role: "Backend developer",
        personality:
          "Direct and impatient. Wants quick decisions and suggests cutting scope. Gets frustrated by long discussions or vague plans. Respects clear, confident direction.",
      },
      {
        name: "Arjun",
        role: "UI designer",
        personality:
          "A perfectionist who cares about quality. Resists cutting features and worries that rushed work will embarrass the team. Calms down when his concerns are acknowledged and he is given a clear role.",
      },
      {
        name: "Meera",
        role: "QA tester",
        personality:
          "Quiet and careful. Rarely speaks unless asked directly. She has noticed a serious problem and shares it only if the leader asks her opinion or invites her to speak. Withdraws further if the louder teammates dominate.",
      },
    ],
  },
  {
    id: "credit-dispute",
    title: "Dispute over credit",
    summary: "Two teammates clash after a presentation and a report is due Friday.",
    brief:
      "Yesterday the department head praised a report in front of everyone but mentioned only Neha, even though Sameer did most of the analysis. Sameer is upset, Neha feels awkward, and the next report is due on Friday. You are the team lead and you have called a short team meeting.",
    goal: "Rebuild trust and agree who does what for Friday's report.",
    hiddenFact:
      "Karan (the intern) saw that Sameer's name was left off the shared slides by accident and not by Neha's choice. He mentions it only if the leader asks him directly.",
    teammates: [
      {
        name: "Sameer",
        role: "Data analyst",
        personality:
          "Quietly angry and defensive. Answers in short sentences and points to facts. Softens if his work is acknowledged by name and he is not blamed.",
      },
      {
        name: "Neha",
        role: "Marketing executive",
        personality:
          "Friendly and eager to keep the peace. Says everything is fine and avoids the real issue. Opens up only if she is gently asked what she really thinks.",
      },
      {
        name: "Karan",
        role: "Intern",
        personality:
          "Eager but unsure. Wants clear instructions, tends to take sides if nobody guides the group, and shares what he knows only when asked directly.",
      },
    ],
  },
];

// END OF FILE

export const SCENARIOS_B: Scenario[] = [
  {
    id: "angry-client",
    title: "Angry client complaint",
    summary: "A big client has escalated and the team starts blaming each other.",
    brief:
      "A major client emailed your director this morning. They say a feature was delivered wrong and that they feel ignored for two weeks. The director wants a recovery plan by end of day. You are the team lead and you have called the team together. Everyone is tired and defensive.",
    goal: "Agree on the cause, a recovery plan and who will talk to the client today.",
    hiddenFact:
      "Dev (support executive) took a call two weeks ago in which the client changed a requirement. He wrote it in an email that was never forwarded to the team. He is afraid of being blamed and shares this only if the leader asks him directly and makes it safe to speak.",
    teammates: [
      {
        name: "Vikram",
        role: "Account manager",
        personality:
          "Image-conscious and defensive. Wants to protect the client relationship and the team's reputation. Pushes responsibility toward the developers. Cooperates when given a clear role in talking to the client.",
      },
      {
        name: "Pooja",
        role: "Developer",
        personality:
          "Overworked and a little bitter. Says the requirements were unclear and she built exactly what was asked. Gets angry if she feels blamed. Calms down when her effort is acknowledged.",
      },
      {
        name: "Dev",
        role: "Support executive",
        personality:
          "Junior, anxious and quiet. Avoids eye contact in a crisis. Has important information but fears being blamed, so he speaks only when asked directly and kindly.",
      },
    ],
  },
  {
    id: "budget-cut",
    title: "Budget cut",
    summary: "Your project budget drops by 20% and the team is worried about jobs.",
    brief:
      "Leadership has told you that your project budget will be cut by 20% starting next month. You cannot promise anything about jobs. Rumours have already started. You have called a team meeting to explain the situation and decide what to cut, without losing the team's trust.",
    goal: "Explain the cut honestly, agree what to reduce, and keep the team motivated.",
    hiddenFact:
      "Anita (finance partner) knows a software vendor contract can be cancelled without a penalty and would save about half of the required cut. She shares this only if the leader asks her to look at the numbers or invites her to speak.",
    teammates: [
      {
        name: "Sanjay",
        role: "Senior engineer",
        personality:
          "Pessimistic and worried about his job. Assumes the worst and asks blunt questions. Respects honesty and gets more upset when the leader sounds vague or overly cheerful.",
      },
      {
        name: "Anita",
        role: "Finance partner",
        personality:
          "Precise and cautious. Speaks only about numbers, does not volunteer ideas and waits to be asked. Becomes helpful when the leader asks for her view on specific figures.",
      },
      {
        name: "Rohan",
        role: "Designer",
        personality:
          "Creative and emotional. Resists any cut that touches quality or his own work. Suggests big ideas without checking the cost. Calms down when his creativity is valued and he is given a clear task.",
      },
    ],
  },
];

// END OF FILE

export const SCENARIOS_C: Scenario[] = [
  {
    id: "star-performer",
    title: "Brilliant but difficult teammate",
    summary: "Your top performer is hurting team morale and others are quietly upset.",
    brief:
      "Aditya is the strongest performer on your team and delivers excellent work. But in the last few weeks teammates have complained that he interrupts them, mocks ideas in meetings and rewrites their work without telling them. Results are still strong, but morale is dropping. You have called a team meeting to talk about how the team works together.",
    goal: "Address the behaviour without losing Aditya or the team, and agree on clear working rules.",
    hiddenFact:
      "Kavya (new hire) has been told by two colleagues that they are thinking of leaving because of how meetings go. She also had her work rewritten by Aditya without notice. She shares this only if the leader asks her directly, in a way that feels safe.",
    teammates: [
      {
        name: "Aditya",
        role: "Senior developer",
        personality:
          "Brilliant, confident and impatient. Believes he is only being efficient. Defends himself by pointing to results. Becomes more open when his skills are acknowledged and the issue is described by behaviour, not as a personal attack.",
      },
      {
        name: "Kavya",
        role: "New developer",
        personality:
          "Capable but timid and hurt. Says everything is fine in front of Aditya. Opens up only if the leader asks her directly and gently.",
      },
      {
        name: "Manish",
        role: "Long-time team member",
        personality:
          "Avoids conflict and jokes to ease tension. Tends to say both sides have a point. Opens up if the leader asks him what he has actually observed.",
      },
    ],
  },
  {
    id: "remote-team",
    title: "New remote team",
    summary: "Your first meeting with a team spread across three time zones.",
    brief:
      "You have just become lead of a new team with members in Bengaluru, Singapore and London. Meetings are currently held at 9 PM for one of them. Some people join with cameras off and rarely speak. This is your first meeting as the lead and you want to set up how the team will work together.",
    goal: "Agree on meeting times, how the team communicates, and make sure everyone has a voice.",
    hiddenFact:
      "Mei (Singapore) has been joining late-night calls for two months and is close to burnout. She mentions this only if the leader asks directly how the current schedule is working for her.",
    teammates: [
      {
        name: "Isha",
        role: "Product manager, Bengaluru",
        personality:
          "Organised and talkative. Likes fixed meetings and clear processes. Tends to speak first and sometimes talks over quieter people. Supportive when given a role in setting up the process.",
      },
      {
        name: "Mei",
        role: "Developer, Singapore",
        personality:
          "Polite, tired and reserved. Says 'it is fine' when asked in a general way. Only reveals how she really feels if the leader asks her personally and listens.",
      },
      {
        name: "Farhan",
        role: "Developer, London",
        personality:
          "Independent and prefers written updates. Thinks most meetings are a waste. Becomes engaged if the leader proposes less meeting time and clearer written updates.",
      },
    ],
  },
  {
    id: "blame-after-mistake",
    title: "Blame after a mistake",
    summary: "A bug went live and people want to know who is responsible.",
    brief:
      "Yesterday a release went live with a bug that exposed wrong prices to customers for two hours. The issue is fixed, but your manager has asked for a report on 'who is responsible'. The team is tense and people are pointing fingers. You have called a team meeting to work out what happened and what to do next.",
    goal: "Find out what really happened, avoid a blame spiral and agree on how to prevent it.",
    hiddenFact:
      "Nisha (QA) did warn about the pricing code in a chat message, but Chirag never saw it because the team has no formal sign-off step before releases. She shares this only if the leader asks what each person saw or knew before the release.",
    teammates: [
      {
        name: "Chirag",
        role: "Developer who released the code",
        personality:
          "Ashamed and defensive. Keeps apologising and offers to take all the blame. Becomes more open if the leader makes it clear this is about the process and not about punishing him.",
      },
      {
        name: "Nisha",
        role: "QA tester",
        personality:
          "Careful and a little defensive. Insists she did her job. Hints that she raised concerns but does not give details unless asked directly what she saw or said before the release.",
      },
      {
        name: "Rahul",
        role: "Project manager",
        personality:
          "Under pressure from above and wants a name to give his manager. Impatient with long discussions. Changes his mind if the leader shows him a clear plan to prevent it from happening again.",
      },
    ],
  },
];


export const SCENARIOS: Scenario[] = [
  ...SCENARIOS_A,
  ...SCENARIOS_B,
  ...SCENARIOS_C,
];

export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}
// END OF FILE