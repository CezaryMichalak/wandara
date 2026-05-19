import OpenAI from "openai";

type Language = "pl" | "en";

type TripRequest = {
  destination: string;
  budget: string;
  days: number;
  style: string;
  interests: string[];
  language: Language;
};

type TripItinerary = {
  tripTitle: string;
  destination: string;
  summary: string;
  bestTimeToVisit: string;
  estimatedBudget: string;
  luxuryTouches: string[];
  days: {
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
    dining: string;
    stay: string;
    highlights: string[];
  }[];
};

const itinerarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "tripTitle",
    "destination",
    "summary",
    "bestTimeToVisit",
    "estimatedBudget",
    "luxuryTouches",
    "days",
  ],
  properties: {
    tripTitle: { type: "string" },
    destination: { type: "string" },
    summary: { type: "string" },
    bestTimeToVisit: { type: "string" },
    estimatedBudget: { type: "string" },
    luxuryTouches: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
    days: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "day",
          "title",
          "morning",
          "afternoon",
          "evening",
          "dining",
          "stay",
          "highlights",
        ],
        properties: {
          day: { type: "number" },
          title: { type: "string" },
          morning: { type: "string" },
          afternoon: { type: "string" },
          evening: { type: "string" },
          dining: { type: "string" },
          stay: { type: "string" },
          highlights: {
            type: "array",
            minItems: 3,
            maxItems: 4,
            items: { type: "string" },
          },
        },
      },
    },
  },
};

const messages = {
  pl: {
    unreadable: "Nie udało się odczytać szczegółów podróży. Spróbuj ponownie.",
    missingBody: "Wyślij szczegóły podróży i spróbuj ponownie.",
    destination: "Podaj cel podróży.",
    budget: "Podaj budżet podróży.",
    days: "Wybierz długość podróży od 1 do 14 dni.",
    style: "Wybierz styl podróży.",
    interests: "Wybierz co najmniej jedno zainteresowanie.",
    openAiMissing:
      "OpenAI nie jest jeszcze skonfigurowane. Dodaj OPENAI_API_KEY do .env.local i uruchom ponownie serwer deweloperski.",
    generationFailed:
      "Nie udało się teraz wygenerować planu. Spróbuj ponownie za chwilę.",
  },
  en: {
    unreadable: "We could not read those trip details. Please try again.",
    missingBody: "Please send your trip details and try again.",
    destination: "Please enter a destination.",
    budget: "Please enter your travel budget.",
    days: "Please choose a trip length between 1 and 14 days.",
    style: "Please choose a travel style.",
    interests: "Please choose at least one interest.",
    openAiMissing:
      "OpenAI is not configured yet. Add OPENAI_API_KEY to .env.local and restart the dev server.",
    generationFailed:
      "We could not generate your itinerary right now. Please try again in a moment.",
  },
} as const;

const languageNames: Record<Language, string> = {
  pl: "Polish",
  en: "English",
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getInterests(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLanguage(value: unknown): Language {
  return value === "en" ? "en" : "pl";
}

function validateTripRequest(body: unknown):
  | { data: TripRequest; error?: never }
  | { data?: never; error: string } {
  const fallbackLanguage: Language = "pl";

  if (!body || typeof body !== "object") {
    return { error: messages[fallbackLanguage].missingBody };
  }

  const requestBody = body as Record<string, unknown>;
  const language = getLanguage(requestBody.language);
  const destination = getString(requestBody.destination);
  const budget = getString(requestBody.budget);
  const style = getString(requestBody.style);
  const interests = getInterests(requestBody.interests);
  const days = Number(requestBody.days);

  if (!destination) {
    return { error: messages[language].destination };
  }

  if (!budget) {
    return { error: messages[language].budget };
  }

  if (!Number.isInteger(days) || days < 1 || days > 14) {
    return { error: messages[language].days };
  }

  if (!style) {
    return { error: messages[language].style };
  }

  if (interests.length === 0) {
    return { error: messages[language].interests };
  }

  return {
    data: {
      destination,
      budget,
      days,
      style,
      interests,
      language,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: messages.pl.unreadable },
      { status: 400 },
    );
  }

  const result = validateTripRequest(body);

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error: messages[result.data.language].openAiMissing,
      },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey });
  const { destination, budget, days, style, interests, language } = result.data;
  const responseLanguage = languageNames[language];

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_output_tokens: 5000,
      instructions: `You are Wandara, a luxury travel concierge. Create practical, refined, detailed itineraries with boutique stays, memorable dining, private or small-group experiences, and a polished editorial tone. Write every generated itinerary field in ${responseLanguage}. Return only valid JSON that matches the requested schema.`,
      input: `Plan a ${days}-day luxury trip to ${destination}.
Budget: ${budget}
Travel style: ${style}
Interests: ${interests.join(", ")}
Language: ${responseLanguage}

Make each day distinct and useful for a traveler. Include realistic pacing, premium experiences, dining ideas, and accommodation style. The days array must contain exactly ${days} items. Every string value in the JSON response must be written in ${responseLanguage}.`,
      text: {
        format: {
          type: "json_schema",
          name: "luxury_travel_itinerary",
          description: `A detailed luxury travel itinerary for Wandara. All string fields must be written in ${responseLanguage}.`,
          strict: true,
          schema: itinerarySchema,
        },
      },
    });

    const itinerary = JSON.parse(response.output_text) as TripItinerary;

    if (itinerary.days.length !== days) {
      itinerary.days = itinerary.days.slice(0, days);
    }

    return Response.json({ itinerary });
  } catch (error) {
    console.error("Trip generation failed:", error);

    return Response.json(
      {
        error: messages[language].generationFailed,
      },
      { status: 500 },
    );
  }
}
