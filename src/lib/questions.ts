export type QuestionChoice = {
  text: string;
  weights: {
    formality?: number;
    brevity?: number;
    humor?: number;
    warmth?: number;
    directness?: number;
    expressiveness?: number;
  };
};

export type ChoiceQuestion = {
  id: string;
  type: 'choice';
  prompt: string;
  options: Record<string, QuestionChoice>;
};

export type FreeTextQuestion = {
  id: string;
  type: 'freeText';
  prompt: string;
  scoringModel: string;
};

export type MultiSelectQuestion = {
  id: string;
  type: 'multi_select';
  prompt: string;
  maxSelections: number;
  options: Record<string, Record<string, number>>;
};

export type Question = ChoiceQuestion | FreeTextQuestion | MultiSelectQuestion;

export const questions: Question[] = [
  {
    id: "q1_greeting",
    type: "choice",
    prompt: "Which greeting feels most natural to you?",
    options: {
      "A": { text: "Hey there, what's up?", weights: { formality: -1, warmth: 0.3 } },
      "B": { text: "Good morning, I hope you're well.", weights: { formality: 1 } }
    }
  },
  {
    id: "q2_signoff",
    type: "choice",
    prompt: "How do you usually end an email?",
    options: {
      "A": { text: "Cheers!", weights: { formality: -1, warmth: 0.2 } },
      "B": { text: "Kind regards,", weights: { formality: 1 } }
    }
  },
  {
    id: "q3_good_news",
    type: "choice",
    prompt: "A colleague shares big news. Your first reaction?",
    options: {
      "A": { text: "LET'S GOOO! 🎉", weights: { expressiveness: 0.8, humor: 0.4 } },
      "B": { text: "Congratulations on the milestone.", weights: { expressiveness: -0.5, formality: 0.6 } }
    }
  },
  {
    id: "q4_sentence_len",
    type: "choice",
    prompt: "Typical sentence length?",
    options: {
      "A": { text: "Short & punchy (≤12 words)", weights: { brevity: 1, directness: 0.4 } },
      "B": { text: "Medium (13–25 words)", weights: { brevity: 0 } },
      "C": { text: "Long and flowing (26+ words)", weights: { brevity: -1, expressiveness: 0.3 } }
    }
  },
  {
    id: "q5_feedback",
    type: "choice",
    prompt: "Give feedback on a draft:",
    options: {
      "A": { text: "Not great. Start over.", weights: { directness: 1 } },
      "B": { text: "Let's adjust a few things to improve.", weights: { directness: -0.5, warmth: 0.4 } }
    }
  },
  {
    id: "q6_invite",
    type: "choice",
    prompt: "Invite a friend to dinner:",
    options: {
      "A": { text: "Swing by around 7, we'll wing it.", weights: { formality: -1, warmth: 0.5 } },
      "B": { text: "Please arrive at 7 p.m.; appetisers will be served.", weights: { formality: 1 } }
    }
  },
  {
    id: "q7_joke",
    type: "choice",
    prompt: "Humor in work chat:",
    options: {
      "A": { text: "Deadline is tomorrow (send coffee).", weights: { humor: 1 } },
      "B": { text: "Deadline is tomorrow.", weights: { humor: -1 } }
    }
  },
  {
    id: "q8_decline",
    type: "choice",
    prompt: "Decline an invitation:",
    options: {
      "A": { text: "Can't—packed day. Rain‑check?", weights: { directness: 0.8, warmth: 0.3 } },
      "B": { text: "Unfortunately I'm unavailable; perhaps next week?", weights: { directness: -0.4, warmth: 0.6 } }
    }
  },
  {
    id: "q9_thanks",
    type: "choice",
    prompt: "Say thank you:",
    options: {
      "A": { text: "Thanks a ton!", weights: { warmth: 1, expressiveness: 0.4 } },
      "B": { text: "Thank you.", weights: { warmth: -0.3, formality: 0.6 } }
    }
  },
  {
    id: "q10_emojis",
    type: "choice",
    prompt: "Emoji usage:",
    options: {
      "A": { text: "Frequently sprinkle them 😊", weights: { expressiveness: 0.7, humor: 0.2 } },
      "B": { text: "Only if essential", weights: { expressiveness: -0.4 } }
    }
  },
  {
    id: "q11_agenda",
    type: "choice",
    prompt: "Send a meeting agenda:",
    options: {
      "A": { text: "Bulleted action points only.", weights: { brevity: 0.8, directness: 0.4 } },
      "B": { text: "Detailed background before action items.", weights: { brevity: -0.8 } }
    }
  },
  {
    id: "q12_details",
    type: "choice",
    prompt: "How much context do you provide before giving advice?",
    options: {
      "A": { text: "Jump straight to the point.", weights: { brevity: 1, directness: 0.5 } },
      "B": { text: "Lay out background first.", weights: { brevity: -1 } }
    }
  },
  {
    id: "q13_urgency",
    type: "choice",
    prompt: "Flag something as urgent:",
    options: {
      "A": { text: "ASAP – fire drill! 🚨", weights: { expressiveness: 0.6, directness: 0.5 } },
      "B": { text: "Please prioritise this task.", weights: { formality: 0.5 } }
    }
  },
  {
    id: "q14_twitter_bio",
    type: "choice",
    prompt: "Which Twitter bio sounds more like you?",
    options: {
      "A": { text: "Product nerd. Coffee addict. Building cool stuff.", weights: { formality: -1, brevity: 0.6 } },
      "B": { text: "Product management professional focused on innovation.", weights: { formality: 1 } }
    }
  },
  {
    id: "q15_caption",
    type: "choice",
    prompt: "Caption for a vacation photo:",
    options: {
      "A": { text: "Living my best life 😎🌴", weights: { expressiveness: 0.8, humor: 0.3 } },
      "B": { text: "Enjoying a well‑deserved break.", weights: { formality: 0.4, expressiveness: -0.3 } }
    }
  },
  {
    id: "q16_reply_friend",
    type: "freeText",
    prompt: "Your friend texts: 'I just quit my job — feeling nervous but free.' Reply in ≤50 words exactly how you normally would.",
    scoringModel: "gpt-4o"
  },
  {
    id: "q17_intro",
    type: "freeText",
    prompt: "Introduce yourself to a new community in ≤40 words.",
    scoringModel: "gpt-4o"
  },
  {
    id: "q18_tone_words",
    type: "multi_select",
    prompt: "Pick up to three words you WANT your tone to convey:",
    maxSelections: 3,
    options: {
      "playful": { "humor": 1 },
      "empathetic": { "warmth": 1 },
      "straight_to_the_point": { "directness": 1 },
      "analytical": { "formality": 1 },
      "poetic": { "expressiveness": 1 },
      "bold": { "directness": 0.5, "humor": 0.5 },
      "chill": { "brevity": 0.5, "warmth": 0.3 },
      "professional": { "formality": 1 }
    }
  },
  {
    id: "q19_values",
    type: "multi_select",
    prompt: "Which values matter most in your writing? (choose up to 2)",
    maxSelections: 2,
    options: {
      "clarity": { "directness": 0.8, "brevity": 0.5 },
      "inspiration": { "expressiveness": 0.7 },
      "precision": { "formality": 0.7 },
      "warmth": { "warmth": 1 },
      "wit": { "humor": 0.8 }
    }
  },
  {
    id: "q20_goals",
    type: "multi_select",
    prompt: "Primary goals for refining your tone? (pick two)",
    maxSelections: 2,
    options: {
      "sound_more_professional": { "formality": 0.8 },
      "be_more_concise": { "brevity": 1 },
      "add_personality": { "expressiveness": 0.8, "humor": 0.4 },
      "increase_warmth": { "warmth": 1 },
      "be_more_direct": { "directness": 1 }
    }
  }
];