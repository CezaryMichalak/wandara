"use client";

import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  BookmarkPlus,
  Compass,
  FileDown,
  Flower2,
  FolderOpen,
  Landmark,
  Martini,
  Mountain,
  ShoppingBag,
  Star,
  Trash2,
  TreePalm,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { jsPDF } from "jspdf";

const translations = {
  pl: {
    nav: [
      { label: "Planner", href: "#planner" },
      { label: "Trasy", href: "#itineraries" },
      { label: "Opinie", href: "#reviews" },
      { label: "Zapisane", href: "#saved-trips" },
    ],
    languageLabel: "Wybierz język",
    startPlanning: "Zacznij planować",
    heroBadge: "Planowanie podróży AI dla niezapomnianych wyjazdów",
    heroTitle:
      "Zaprojektuj luksusową podróż w kilka minut, dopasowaną do Twojego stylu.",
    heroBody:
      "Wandara zamienia kierunek, budżet, tempo i pasje w dopracowany plan z butikowymi noclegami, wyrafinowaną kuchnią i lokalnymi perełkami.",
    primaryCta: "Wygeneruj moją podróż",
    secondaryCta: "Zobacz przykładowe plany",
    stats: {
      totalReviews: "opinie podróżników",
      countries: "obsługiwanych krajów",
      averageRating: "średnia ocena",
    },
    plannerEyebrow: "Studio podróży",
    plannerTitle: "Zbuduj swój plan",
    plannerBody:
      "Podaj podstawy, a Wandara ułoży idealny plan na każdy dzień.",
    destinationLabel: "Cel podróży",
    destinationPlaceholder: "Tokio, Wybrzeże Amalfi, Patagonia...",
    budgetLabel: "Budżet",
    budgetPlaceholder: "15 000 zł",
    daysLabel: "Liczba dni",
    dayOption: (days: number) => `${days} ${days === 1 ? "dzień" : "dni"}`,
    travelStyleLabel: "Styl podróży",
    travelStyles: {
      luxuryEscape: "Luksusowy wyjazd",
      culturalImmersion: "Kulturowe zanurzenie",
      adventure: "Przygoda",
      remoteWork: "Praca zdalna",
    },
    interestsLabel: "Zainteresowania",
    interests: {
      fineDining: "Fine dining",
      hiddenBeaches: "Ukryte plaże",
      museums: "Muzea",
      nightMarkets: "Nocne targi",
      wellness: "Wellness",
      architecture: "Architektura",
    },
    errorFallback: "Coś poszło nie tak podczas generowania podróży.",
    loadingMessages: [
      "Tworzymy Twoją idealną podróż...",
      "Szukamy ukrytych perełek...",
      "Projektujemy Twój plan...",
    ],
    loadingEyebrow: "AI concierge pracuje",
    loadingHelper:
      "Łączymy butikowe noclegi, wyrafinowaną kuchnię i lokalne doświadczenia w dopracowany plan dnia.",
    generateButton: "Wygeneruj podróż",
    generatedEyebrow: "Wygenerowany plan",
    sampleEyebrow: "Przykładowe plany",
    sampleTitle: "Kuratowane trasy z miejscem na zachwyt.",
    destinationCard: "Cel podróży",
    budgetCard: "Budżet",
    bestTimeCard: "Najlepszy termin",
    luxuryTouches: "Luksusowe akcenty",
    dayLabel: "Dzień",
    generatedStyleLabel: "Styl",
    morning: "Rano",
    afternoon: "Popołudnie",
    evening: "Wieczór",
    dining: "Kuchnia",
    stay: "Nocleg",
    estimatedBudgetFrom: "Szacowany budżet od",
    viewSamplePreview: "Zobacz szczegóły",
    previewEyebrow: "Podgląd przykładowej podróży",
    closePreview: "Zamknij podgląd",
    saveTripButton: "Zapisz podróż",
    tripSavedButton: "Podróż zapisana",
    savedTripSaved: "Plan zapisany w Twojej prywatnej kolekcji.",
    savedTripUpdated: "Zapisany plan został odświeżony.",
    savedTripReopened: "Przywrócono zapisany plan bez ponownego generowania.",
    savedTripsEyebrow: "Prywatna kolekcja",
    savedTripsTitle: "Zapisane podróże gotowe do powrotu.",
    savedTripsBody:
      "Przechowuj najlepsze plany lokalnie w przeglądarce, wracaj do nich jednym kliknięciem i porządkuj swoją kolekcję bez konta.",
    savedTripsEmptyTitle: "Brak zapisanych podróży",
    savedTripsEmptyBody:
      "Wygeneruj plan, zapisz go i zbuduj własną bibliotekę luksusowych wyjazdów.",
    savedTripDays: (days: number) => `${days} ${days === 1 ? "dzień" : "dni"}`,
    savedTripBudgetLabel: "Budżet",
    savedTripCreatedLabel: "Zapisano",
    reopenSavedTrip: "Otwórz plan",
    exportPdfButton: "Eksportuj PDF",
    deleteSavedTrip: "Usuń",
    reviewsEyebrow: "Opinie podróżników",
    reviewsTitle: "Oceń Wandara i pomóż nam dopracować doświadczenie.",
    reviewsBody:
      "Twoja opinia zostaje wyłącznie w tej przeglądarce. Dodaj ocenę, opcjonalny komentarz i śledź lokalne statystyki społeczności.",
    reviewsKpis: {
      average: "Średnia ocena",
      total: "Liczba opinii",
      fiveStar: "Opinii 5-gwiazdkowych",
    },
    reviewRatingLabel: "Twoja ocena",
    reviewCommentLabel: "Krótka opinia (opcjonalnie)",
    reviewCommentPlaceholder:
      "Co działa najlepiej? Co warto jeszcze dopracować?",
    reviewSubmitButton: "Zapisz opinię",
    reviewValidation: "Wybierz ocenę od 1 do 5 gwiazdek.",
    reviewsEmptyTitle: "Brak opinii lokalnych",
    reviewsEmptyBody:
      "Bądź pierwszą osobą, która oceni Wandara w tej przeglądarce.",
    reviewCreatedLabel: "Dodano",
    deleteReview: "Usuń opinię",
    starRatingAria: (rating: number) => `Oceń ${rating} z 5 gwiazdek`,
    samplePreviewLabels: {
      destination: "Cel",
      days: "Długość",
      budget: "Budżet",
      intro: "Wprowadzenie",
      itinerary: "Plan dzień po dniu",
      highlights: "Najważniejsze atrakcje",
      food: "Rekomendacje kulinarne",
      tips: "Wskazówki w podróży",
      style: "Sugerowany styl",
    },
    pdfLabels: {
      brandLine: "Premium travel plan",
      destination: "Cel podróży",
      tripTitle: "Tytuł podróży",
      days: "Liczba dni",
      estimatedBudget: "Szacowany budżet",
      bestTime: "Najlepszy termin",
      overview: "Wprowadzenie",
      itinerary: "Plan dzień po dniu",
      highlights: "Najważniejsze atrakcje",
      food: "Rekomendacje kulinarne",
      tips: "Wskazówki w podróży",
      luxuryTouches: "Luksusowe akcenty",
      day: "Dzień",
      morning: "Rano",
      afternoon: "Popołudnie",
      evening: "Wieczór",
      dining: "Kuchnia",
      stay: "Nocleg",
      missing: "Do uzupełnienia",
      preparedBy: "Przygotowano przez Wandara",
    },
    sampleItineraries: [
      {
        city: "Kioto",
        title: "Ogrody zen i prywatne domy herbaty",
        days: "5 dni",
        budget: "$2,400",
        intro:
          "Spokojna, dopracowana trasa przez świątynie, ogrody i prywatne ceremonie, która pokazuje jak Wandara łączy rytm dnia z luksusowymi detalami.",
        tripStyle: "Kulturowe zanurzenie premium",
        itinerary: [
          {
            day: 1,
            title: "Powitanie w Gion",
            description:
              "Prywatny transfer do ryokanu, spacer po Gion i kolacja kaiseki z widokiem na kamienny ogród.",
          },
          {
            day: 2,
            title: "Arashiyama o świcie",
            description:
              "Wczesny przejazd do bambusowego lasu, wizyta w Tenryu-ji i popołudniowa herbata w ukrytym domu herbaty.",
          },
          {
            day: 3,
            title: "Świątynie i rzemiosło",
            description:
              "Fushimi Inari przed tłumami, warsztat ceramiki oraz degustacja sake prowadzona przez lokalnego eksperta.",
          },
          {
            day: 4,
            title: "Filozoficzny spacer",
            description:
              "Wolniejsze tempo przy Srebrnym Pawilonie, lunch sezonowy i prywatna sesja medytacji zen.",
          },
          {
            day: 5,
            title: "Ostatni rytuał",
            description:
              "Poranna kąpiel onsen, zakupy w butikach z rzemiosłem i elegancki wyjazd z gotową listą miejsc na powrót.",
          },
        ],
        highlights: [
          "Pobyt w ryokanie",
          "Degustacja Michelin",
          "Poranek w Arashiyamie",
        ],
        foodRecommendations: [
          "Kaiseki z sezonowymi składnikami",
          "Prywatna degustacja matchy",
          "Sake pairing w Pontocho",
        ],
        travelTips: [
          "Zacznij najpopularniejsze świątynie przed 8:00.",
          "Zarezerwuj ryokan z prywatnym onsenem.",
          "Zostaw wolne popołudnie na spokojne spacery.",
        ],
      },
      {
        city: "Lizbona",
        title: "Designerskie hotele, fado i widoki na Atlantyk",
        days: "7 dni",
        budget: "$3,100",
        intro:
          "Siedem dni pastelowych ulic, butikowych hoteli i kolacji nad Atlantykiem, zaprojektowanych z równowagą między zwiedzaniem a odpoczynkiem.",
        tripStyle: "Stylowy city break z wybrzeżem",
        itinerary: [
          {
            day: 1,
            title: "Check-in z widokiem",
            description:
              "Przyjazd do hotelu w Chiado, sunset drink na tarasie i pierwsza kolacja z owocami morza.",
          },
          {
            day: 2,
            title: "Alfama i fado",
            description:
              "Prywatny spacer po Alfamie, azulejos w małych pracowniach i wieczór fado przy kameralnym stoliku.",
          },
          {
            day: 3,
            title: "Design i Belém",
            description:
              "Galerie designu, klasztor Hieronimitów, pasteis de nata i rejs o złotej godzinie.",
          },
          {
            day: 4,
            title: "Sintra bez pośpiechu",
            description:
              "Kierowca do Sintry, ogrody Quinta da Regaleira i lunch w pałacowym hotelu.",
          },
          {
            day: 5,
            title: "Atlantyckie plaże",
            description:
              "Dzień w Cascais, klub plażowy, lekka aktywność na wodzie i kolacja przy zachodzie słońca.",
          },
          {
            day: 6,
            title: "Douro na jeden dzień",
            description:
              "Lot lub szybki transfer do Porto, degustacja wina w Douro i powrót wieczorem.",
          },
          {
            day: 7,
            title: "Ostatni poranek",
            description:
              "Powolne śniadanie, zakupy w concept store i transfer na lotnisko bez stresu.",
          },
        ],
        highlights: ["Spacer po Alfamie", "Dzień w Douro", "Kolacje na dachu"],
        foodRecommendations: [
          "Nowoczesne petiscos w Bairro Alto",
          "Owoce morza w Cais do Sodré",
          "Degustacja porto w Douro",
        ],
        travelTips: [
          "Wybierz hotel w Chiado lub Príncipe Real dla wygodnej bazy.",
          "Na Sintrę rusz wcześnie i z kierowcą.",
          "Zostaw wieczory na rezerwacje z widokiem.",
        ],
      },
      {
        city: "Bali",
        title: "Wille wellness i nadmorskie przygody",
        days: "10 dni",
        budget: "$4,800",
        intro:
          "Przykład podróży, która łączy prywatną willę, regenerację w Ubud i aktywny czas nad oceanem bez utraty komfortu.",
        tripStyle: "Wellness, natura i miękka przygoda",
        itinerary: [
          {
            day: 1,
            title: "Przylot i wyciszenie",
            description:
              "Transfer do willi w Ubud, masaż po podróży i lekka kolacja z lokalnych składników.",
          },
          {
            day: 2,
            title: "Ubud wellness",
            description:
              "Joga o poranku, prywatna konsultacja spa i spacer po tarasach ryżowych.",
          },
          {
            day: 3,
            title: "Świątynie i rytuały",
            description:
              "Tirta Empul z przewodnikiem, oczyszczający rytuał i kolacja degustacyjna w dżungli.",
          },
          {
            day: 4,
            title: "Kreatywny dzień",
            description:
              "Warsztat gotowania, wizyta u rzemieślników i popołudnie przy prywatnym basenie.",
          },
          {
            day: 5,
            title: "Przejazd na wybrzeże",
            description:
              "Sceniczny transfer do Canggu, check-in w willi i kolacja na plaży.",
          },
          {
            day: 6,
            title: "Surf z instruktorem",
            description:
              "Prywatna lekcja surfingu, regeneracyjny lunch i zachód słońca w klubie plażowym.",
          },
          {
            day: 7,
            title: "Uluwatu",
            description:
              "Klify, ukryte plaże, świątynia Uluwatu i kolacja z widokiem na fale.",
          },
          {
            day: 8,
            title: "Nusa Penida",
            description:
              "Prywatna łódź, spokojniejsze punkty widokowe i piknik przygotowany przez concierge.",
          },
          {
            day: 9,
            title: "Dzień oddechu",
            description:
              "Wolny poranek, zabiegi spa, zakupy w butikach i ostatnia kolacja degustacyjna.",
          },
          {
            day: 10,
            title: "Wyjazd bez pośpiechu",
            description:
              "Późne śniadanie, pakowanie z pomocą obsługi willi i prywatny transfer na lotnisko.",
          },
        ],
        highlights: [
          "Retreat w Ubud",
          "Prywatny instruktor surfingu",
          "Wycieczka po świątyniach",
        ],
        foodRecommendations: [
          "Kolacja degustacyjna w Ubud",
          "Świeże owoce morza w Jimbaran",
          "Roślinne lunche wellness",
        ],
        travelTips: [
          "Podziel pobyt między Ubud i wybrzeże.",
          "Zarezerwuj prywatnego kierowcę na dni świątynne.",
          "Zaplanuj odpoczynek po intensywnych wycieczkach.",
        ],
      },
    ],
    footerText: "Wandara planuje premium podróże dla ciekawych świata.",
    footerLinks: ["Prywatność", "Regulamin", "Kontakt"],
  },
  en: {
    nav: [
      { label: "Planner", href: "#planner" },
      { label: "Itineraries", href: "#itineraries" },
      { label: "Reviews", href: "#reviews" },
      { label: "Saved", href: "#saved-trips" },
    ],
    languageLabel: "Choose language",
    startPlanning: "Start planning",
    heroBadge: "AI travel planning for unforgettable escapes",
    heroTitle:
      "Design a luxury trip in minutes, tailored to the way you travel.",
    heroBody:
      "Wandara turns your destination, budget, pace, and passions into a polished itinerary with boutique stays, refined dining, and hidden local experiences.",
    primaryCta: "Generate my trip",
    secondaryCta: "View sample plans",
    stats: {
      totalReviews: "Traveler reviews",
      countries: "Countries covered",
      averageRating: "Average rating",
    },
    plannerEyebrow: "Trip studio",
    plannerTitle: "Build your itinerary",
    plannerBody:
      "Share the basics and Wandara will shape the perfect daily plan.",
    destinationLabel: "Destination",
    destinationPlaceholder: "Tokyo, Amalfi Coast, Patagonia...",
    budgetLabel: "Budget",
    budgetPlaceholder: "$3,500",
    daysLabel: "Number of days",
    dayOption: (days: number) => `${days} days`,
    travelStyleLabel: "Travel style",
    travelStyles: {
      luxuryEscape: "Luxury escape",
      culturalImmersion: "Cultural immersion",
      adventure: "Adventure",
      remoteWork: "Remote work",
    },
    interestsLabel: "Interests",
    interests: {
      fineDining: "Fine dining",
      hiddenBeaches: "Hidden beaches",
      museums: "Museums",
      nightMarkets: "Night markets",
      wellness: "Wellness",
      architecture: "Architecture",
    },
    errorFallback: "Something went wrong while generating your trip.",
    loadingMessages: [
      "Crafting your perfect journey...",
      "Finding hidden gems...",
      "Designing your itinerary...",
    ],
    loadingEyebrow: "AI concierge at work",
    loadingHelper:
      "We are balancing boutique stays, refined dining, and local moments into a polished daily plan.",
    generateButton: "Generate trip",
    generatedEyebrow: "Generated itinerary",
    sampleEyebrow: "Sample itineraries",
    sampleTitle: "Curated routes with room for wonder.",
    destinationCard: "Destination",
    budgetCard: "Budget",
    bestTimeCard: "Best time",
    luxuryTouches: "Luxury touches",
    dayLabel: "Day",
    generatedStyleLabel: "Style",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    dining: "Dining",
    stay: "Stay",
    estimatedBudgetFrom: "Estimated budget from",
    viewSamplePreview: "View preview",
    previewEyebrow: "Sample trip preview",
    closePreview: "Close preview",
    saveTripButton: "Save trip",
    tripSavedButton: "Trip saved",
    savedTripSaved: "Itinerary saved to your private collection.",
    savedTripUpdated: "Saved itinerary refreshed.",
    savedTripReopened: "Saved itinerary restored without generating again.",
    savedTripsEyebrow: "Private collection",
    savedTripsTitle: "Saved trips ready to revisit.",
    savedTripsBody:
      "Keep your best plans locally in this browser, reopen them with one click, and curate your collection without an account.",
    savedTripsEmptyTitle: "No saved trips yet",
    savedTripsEmptyBody:
      "Generate an itinerary, save it, and build your own library of luxury escapes.",
    savedTripDays: (days: number) => `${days} ${days === 1 ? "day" : "days"}`,
    savedTripBudgetLabel: "Budget",
    savedTripCreatedLabel: "Saved",
    reopenSavedTrip: "Open plan",
    exportPdfButton: "Export to PDF",
    deleteSavedTrip: "Delete",
    reviewsEyebrow: "Traveler feedback",
    reviewsTitle: "Rate Wandara and help refine the experience.",
    reviewsBody:
      "Your review stays only in this browser. Add a rating, optional comment, and watch the local feedback metrics update.",
    reviewsKpis: {
      average: "Average rating",
      total: "Total reviews",
      fiveStar: "5-star reviews",
    },
    reviewRatingLabel: "Your rating",
    reviewCommentLabel: "Short review (optional)",
    reviewCommentPlaceholder:
      "What feels most useful? What should be polished next?",
    reviewSubmitButton: "Save review",
    reviewValidation: "Choose a rating from 1 to 5 stars.",
    reviewsEmptyTitle: "No local reviews yet",
    reviewsEmptyBody:
      "Be the first person to rate Wandara in this browser.",
    reviewCreatedLabel: "Added",
    deleteReview: "Delete review",
    starRatingAria: (rating: number) => `Rate ${rating} out of 5 stars`,
    samplePreviewLabels: {
      destination: "Destination",
      days: "Length",
      budget: "Budget",
      intro: "Intro",
      itinerary: "Day-by-day itinerary",
      highlights: "Highlights",
      food: "Food recommendations",
      tips: "Travel tips",
      style: "Suggested style",
    },
    pdfLabels: {
      brandLine: "Premium travel plan",
      destination: "Destination",
      tripTitle: "Trip title",
      days: "Number of days",
      estimatedBudget: "Estimated budget",
      bestTime: "Best time to visit",
      overview: "Overview",
      itinerary: "Day-by-day itinerary",
      highlights: "Highlights",
      food: "Food recommendations",
      tips: "Travel tips",
      luxuryTouches: "Luxury touches",
      day: "Day",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      dining: "Dining",
      stay: "Stay",
      missing: "To be confirmed",
      preparedBy: "Prepared by Wandara",
    },
    sampleItineraries: [
      {
        city: "Kyoto",
        title: "Zen gardens and private tea houses",
        days: "5 days",
        budget: "$2,400",
        intro:
          "A calm, polished route through temples, gardens, and private ceremonies that shows how Wandara balances daily rhythm with luxury detail.",
        tripStyle: "Premium cultural immersion",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Gion",
            description:
              "Private transfer to a ryokan, an evening walk through Gion, and kaiseki dinner overlooking a stone garden.",
          },
          {
            day: 2,
            title: "Arashiyama at sunrise",
            description:
              "Early bamboo grove visit, Tenryu-ji gardens, and afternoon tea inside a hidden private tea house.",
          },
          {
            day: 3,
            title: "Temples and craft",
            description:
              "Fushimi Inari before the crowds, a ceramics workshop, and sake tasting guided by a local expert.",
          },
          {
            day: 4,
            title: "Philosopher's path",
            description:
              "A slower day near the Silver Pavilion, a seasonal lunch, and a private zen meditation session.",
          },
          {
            day: 5,
            title: "Final ritual",
            description:
              "Morning onsen, artisan boutique shopping, and a graceful departure with a curated return list.",
          },
        ],
        highlights: ["Ryokan stay", "Michelin tasting", "Arashiyama sunrise"],
        foodRecommendations: [
          "Seasonal kaiseki dinner",
          "Private matcha tasting",
          "Sake pairing in Pontocho",
        ],
        travelTips: [
          "Start the most popular temples before 8:00.",
          "Book a ryokan with a private onsen.",
          "Leave one afternoon open for slow wandering.",
        ],
      },
      {
        city: "Lisbon",
        title: "Design hotels, fado, and Atlantic views",
        days: "7 days",
        budget: "$3,100",
        intro:
          "Seven days of pastel streets, boutique hotels, and Atlantic dinners designed with the right balance of discovery and downtime.",
        tripStyle: "Stylish city escape with coast",
        itinerary: [
          {
            day: 1,
            title: "Check-in with a view",
            description:
              "Arrive at a Chiado hotel, enjoy sunset drinks on a terrace, and start with a seafood dinner.",
          },
          {
            day: 2,
            title: "Alfama and fado",
            description:
              "Private Alfama walk, azulejo studios, and an intimate fado evening at a reserved table.",
          },
          {
            day: 3,
            title: "Design and Belem",
            description:
              "Design galleries, Jeronimos Monastery, pasteis de nata, and a golden-hour river cruise.",
          },
          {
            day: 4,
            title: "Sintra without rush",
            description:
              "Driver-led Sintra day, Quinta da Regaleira gardens, and lunch inside a palace hotel.",
          },
          {
            day: 5,
            title: "Atlantic beaches",
            description:
              "Cascais day, a beach club, light water activity, and dinner as the sun drops over the ocean.",
          },
          {
            day: 6,
            title: "Douro for the day",
            description:
              "Quick flight or fast transfer to Porto, Douro wine tasting, and an evening return.",
          },
          {
            day: 7,
            title: "Last morning",
            description:
              "Slow breakfast, concept-store shopping, and a stress-free airport transfer.",
          },
        ],
        highlights: ["Alfama walk", "Douro day trip", "Rooftop dinners"],
        foodRecommendations: [
          "Modern petiscos in Bairro Alto",
          "Seafood around Cais do Sodre",
          "Port tasting in the Douro",
        ],
        travelTips: [
          "Choose Chiado or Principe Real as a convenient base.",
          "Visit Sintra early and with a driver.",
          "Keep evenings free for view-led reservations.",
        ],
      },
      {
        city: "Bali",
        title: "Wellness villas and coastal adventures",
        days: "10 days",
        budget: "$4,800",
        intro:
          "A sample journey that blends a private villa, restorative time in Ubud, and active ocean days without losing comfort.",
        tripStyle: "Wellness, nature, and soft adventure",
        itinerary: [
          {
            day: 1,
            title: "Arrival and reset",
            description:
              "Transfer to an Ubud villa, post-flight massage, and a light dinner with local ingredients.",
          },
          {
            day: 2,
            title: "Ubud wellness",
            description:
              "Morning yoga, private spa consultation, and a guided walk through rice terraces.",
          },
          {
            day: 3,
            title: "Temples and rituals",
            description:
              "Tirta Empul with a guide, a cleansing ritual, and a jungle tasting dinner.",
          },
          {
            day: 4,
            title: "Creative day",
            description:
              "Cooking workshop, artisan visits, and a quiet afternoon by the private pool.",
          },
          {
            day: 5,
            title: "Move to the coast",
            description:
              "Scenic transfer to Canggu, villa check-in, and a relaxed beach dinner.",
          },
          {
            day: 6,
            title: "Surf with a guide",
            description:
              "Private surf lesson, restorative lunch, and sunset at a beach club.",
          },
          {
            day: 7,
            title: "Uluwatu cliffs",
            description:
              "Cliff viewpoints, hidden beaches, Uluwatu Temple, and dinner above the waves.",
          },
          {
            day: 8,
            title: "Nusa Penida",
            description:
              "Private boat, quieter viewpoints, and a concierge-prepared picnic.",
          },
          {
            day: 9,
            title: "Breathing room",
            description:
              "Open morning, spa treatments, boutique shopping, and a final tasting dinner.",
          },
          {
            day: 10,
            title: "Easy departure",
            description:
              "Late breakfast, villa team packing help, and private airport transfer.",
          },
        ],
        highlights: ["Ubud retreat", "Private surf guide", "Temple tour"],
        foodRecommendations: [
          "Tasting dinner in Ubud",
          "Fresh seafood in Jimbaran",
          "Plant-forward wellness lunches",
        ],
        travelTips: [
          "Split the stay between Ubud and the coast.",
          "Book a private driver for temple days.",
          "Schedule recovery time after bigger excursions.",
        ],
      },
    ],
    footerText: "Wandara plans premium travel for curious people.",
    footerLinks: ["Privacy", "Terms", "Contact"],
  },
} as const;

type Language = keyof typeof translations;
type TravelStyle = keyof typeof translations.pl.travelStyles;
type Interest = keyof typeof translations.pl.interests;

type PlannerForm = {
  destination: string;
  budget: string;
  days: string;
  style: TravelStyle;
  interests: Interest[];
};

type GeneratedItinerary = {
  tripTitle: string;
  destination: string;
  summary: string;
  bestTimeToVisit: string;
  estimatedBudget: string;
  luxuryTouches: string[];
  foodRecommendations?: string[];
  travelTips?: string[];
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

type SavedTrip = {
  id: string;
  title: string;
  destination: string;
  createdAt: string;
  language: Language;
  formSnapshot: PlannerForm;
  itinerary: GeneratedItinerary;
};

type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

type ItineraryIconMatch = {
  icon: LucideIcon;
  keywords: string[];
};

type DestinationArtworkVariant =
  | "egypt"
  | "paris"
  | "london"
  | "japan"
  | "bali"
  | "generic";

type DestinationArtworkMatch = {
  variant: DestinationArtworkVariant;
  keywords: string[];
};

const itineraryIconMatches: ItineraryIconMatch[] = [
  {
    icon: TreePalm,
    keywords: [
      "beach",
      "coast",
      "coastal",
      "island",
      "ocean",
      "sea",
      "surf",
      "plaża",
      "plaże",
      "wybrzeże",
      "morze",
      "surfing",
    ],
  },
  {
    icon: Martini,
    keywords: [
      "bar",
      "cocktail",
      "club",
      "fado",
      "jazz",
      "lounge",
      "night market",
      "nightlife",
      "rooftop",
      "bar",
      "koktajl",
      "klub",
      "nocny targ",
      "nocne targi",
      "kolacje na dachu",
    ],
  },
  {
    icon: Flower2,
    keywords: [
      "massage",
      "meditation",
      "retreat",
      "spa",
      "wellness",
      "yoga",
      "zen",
      "masaży",
      "medytacja",
      "retreat",
      "spa",
      "wellness",
      "joga",
    ],
  },
  {
    icon: Mountain,
    keywords: [
      "alpine",
      "canyon",
      "climb",
      "hike",
      "hiking",
      "mountain",
      "trail",
      "trek",
      "volcano",
      "góry",
      "szlak",
      "wędrówka",
      "trekking",
      "wulkan",
    ],
  },
  {
    icon: Landmark,
    keywords: [
      "architecture",
      "castle",
      "cathedral",
      "gallery",
      "landmark",
      "museum",
      "palace",
      "temple",
      "architektura",
      "zamek",
      "katedra",
      "galeria",
      "muzeum",
      "pałac",
      "świątynia",
    ],
  },
  {
    icon: ShoppingBag,
    keywords: [
      "boutique",
      "market",
      "shopping",
      "shops",
      "souks",
      "stores",
      "butik",
      "targ",
      "zakupy",
      "sklepy",
    ],
  },
  {
    icon: Utensils,
    keywords: [
      "chef",
      "cuisine",
      "dining",
      "dinner",
      "food",
      "michelin",
      "restaurant",
      "tasting",
      "tea house",
      "wine",
      "kuchnia",
      "kolacja",
      "jedzenie",
      "michelin",
      "restauracja",
      "degustacja",
      "dom herbaty",
      "wino",
    ],
  },
];

const destinationArtworkMatches: DestinationArtworkMatch[] = [
  {
    variant: "egypt",
    keywords: ["egypt", "cairo", "giza", "egipt", "kair", "giza"],
  },
  {
    variant: "paris",
    keywords: ["paris", "france", "paryż", "paryz", "francja"],
  },
  {
    variant: "london",
    keywords: ["london", "england", "uk", "britain", "londyn", "anglia"],
  },
  {
    variant: "japan",
    keywords: [
      "japan",
      "tokyo",
      "kyoto",
      "kioto",
      "japonia",
      "tokio",
      "sakura",
    ],
  },
  {
    variant: "bali",
    keywords: ["bali", "ubud", "indonesia", "indonezja"],
  },
];

const artworkGradientClasses: Record<DestinationArtworkVariant, string> = {
  egypt: "from-amber-300/20 via-cyan-300/10 to-violet-400/15",
  paris: "from-sky-300/15 via-violet-300/10 to-rose-300/15",
  london: "from-cyan-300/15 via-slate-200/10 to-violet-300/15",
  japan: "from-rose-300/15 via-cyan-300/10 to-violet-400/15",
  bali: "from-emerald-300/15 via-cyan-300/10 to-violet-400/15",
  generic: "from-cyan-300/15 via-sky-300/10 to-violet-400/15",
};

function getContextualIcon(textParts: string[]): LucideIcon {
  const searchableText = textParts.join(" ").toLowerCase();
  const iconMatch = itineraryIconMatches.find(({ keywords }) =>
    keywords.some((keyword) => searchableText.includes(keyword)),
  );

  return iconMatch?.icon ?? Compass;
}

function getDestinationArtworkVariant(
  textParts: string[],
): DestinationArtworkVariant {
  const searchableText = textParts.join(" ").toLowerCase();
  const artworkMatch = destinationArtworkMatches.find(({ keywords }) =>
    keywords.some((keyword) => searchableText.includes(keyword)),
  );

  return artworkMatch?.variant ?? "generic";
}

function renderDestinationArtwork(variant: DestinationArtworkVariant) {
  switch (variant) {
    case "egypt":
      return (
        <>
          <path d="M36 88 72 34l38 54Z" fill="currentColor" opacity="0.12" />
          <path d="M72 34 86 88M36 88h74" />
          <path d="M114 88 139 54l25 34Z" fill="currentColor" opacity="0.08" />
          <path d="M18 95c28-8 54-8 78 0s51 8 84-3" opacity="0.7" />
          <circle cx="142" cy="36" r="12" fill="currentColor" opacity="0.08" />
        </>
      );
    case "paris":
      return (
        <>
          <path d="M87 30 58 94M93 30l29 64M73 61h34M64 78h52M55 96h72" />
          <path d="M90 30 81 96M90 30l9 66" opacity="0.75" />
          <path d="M18 100c30-13 52-13 82 0s50 10 82-4" opacity="0.7" />
          <path d="M139 74c7-6 13-6 20 0v22h-20Z" opacity="0.5" />
        </>
      );
    case "london":
      return (
        <>
          <path d="M42 40h17v58H42ZM45 34h11M49 25v9" />
          <path d="M48 50h5M48 62h5M48 74h5" opacity="0.65" />
          <path d="M85 58h55M85 58v40M140 58v40M93 67l19 18 20-18" />
          <path d="M72 98c26-10 54-10 90 0" opacity="0.65" />
          <circle cx="50.5" cy="43" r="5.5" opacity="0.8" />
        </>
      );
    case "japan":
      return (
        <>
          <path d="M44 56h84M54 68h64M61 56v42M111 56v42" />
          <path d="M70 82h32l8 16H62Z" fill="currentColor" opacity="0.08" />
          <path d="M135 92c8-14 18-23 31-28M150 78c5 1 9 4 12 9M148 78c-4-3-8-4-13-4" opacity="0.65" />
          <circle cx="148" cy="48" r="12" fill="currentColor" opacity="0.08" />
          <path d="M17 101c35-8 64-8 95 0s47 7 70-2" opacity="0.65" />
        </>
      );
    case "bali":
      return (
        <>
          <path d="M42 99c6-25 14-42 27-58M63 47c-13-3-24 0-34 10M67 42c-1-12-7-20-18-26M72 41c10-10 22-14 36-12M70 49c11 3 20 10 27 20" />
          <path d="M112 96h46M119 80h32l7 16h-46ZM126 66h18l7 14h-32Z" />
          <path d="M128 66 135 52l9 14" opacity="0.75" />
          <path d="M15 101c30-9 55-9 86 0s52 8 79-2" opacity="0.65" />
        </>
      );
    case "generic":
      return (
        <>
          <path d="M28 96 65 58l26 24 23-34 42 48Z" fill="currentColor" opacity="0.08" />
          <path d="M28 96 65 58l26 24 23-34 42 48" />
          <path d="M45 43c28-19 59-19 93 0M65 34c14-8 31-8 50 0" opacity="0.55" />
          <path d="M124 67 159 52l-14 35-8-13-13-7Z" fill="currentColor" opacity="0.1" />
          <path d="M18 101c39-9 71-9 108 0 19 5 36 4 53-2" opacity="0.65" />
        </>
      );
  }
}

function DestinationArtwork({
  variant,
  className = "",
}: {
  variant: DestinationArtworkVariant;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${artworkGradientClasses[variant]} shadow-inner shadow-white/5 transition duration-500 group-hover:scale-[1.02] group-hover:border-cyan-200/20 group-hover:shadow-cyan-300/10 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.2),transparent_26%),radial-gradient(circle_at_78%_28%,rgba(103,232,249,0.18),transparent_28%),linear-gradient(180deg,transparent,rgba(2,6,23,0.35))]" />
      <div className="absolute -left-10 top-6 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl transition duration-500 group-hover:bg-cyan-200/20" />
      <div className="absolute -right-8 bottom-2 h-24 w-24 rounded-full bg-violet-300/10 blur-3xl transition duration-500 group-hover:bg-violet-300/20" />
      <svg
        className="absolute inset-0 h-full w-full text-cyan-50/45 transition duration-500 group-hover:text-cyan-50/60"
        viewBox="0 0 190 120"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      >
        <path d="M14 103h162" opacity="0.22" />
        {renderDestinationArtwork(variant)}
      </svg>
    </div>
  );
}

function getDayIcon(day: GeneratedItinerary["days"][number]): LucideIcon {
  return getContextualIcon([
    day.title,
    day.morning,
    day.afternoon,
    day.evening,
    ...day.highlights,
  ]);
}

type SampleItinerary = (typeof translations)[Language]["sampleItineraries"][number];

function getSampleItineraryIcon(trip: SampleItinerary): LucideIcon {
  return getContextualIcon([trip.city, trip.title, ...trip.highlights]);
}

type GenerateTripResponse = {
  itinerary?: GeneratedItinerary;
  error?: string;
};

const initialForm: PlannerForm = {
  destination: "",
  budget: "",
  days: "7",
  style: "luxuryEscape",
  interests: ["fineDining", "wellness"],
};

const languageSwapDelayMs = 120;
const languageTransitionMs = 260;
const savedTripsStorageKey = "wandara.savedTrips";
const reviewsStorageKey = "wandara.reviews";

function getSavedTripId(itinerary: GeneratedItinerary) {
  return [
    itinerary.destination,
    itinerary.tripTitle,
    itinerary.days.length,
    itinerary.estimatedBudget,
  ]
    .join("|")
    .toLowerCase()
    .replace(/[^a-z0-9ąćęłńóśźż]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function isPlannerFormSnapshot(value: unknown): value is PlannerForm {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PlannerForm>;

  return (
    typeof candidate.destination === "string" &&
    typeof candidate.budget === "string" &&
    typeof candidate.days === "string" &&
    typeof candidate.style === "string" &&
    Array.isArray(candidate.interests)
  );
}

function isGeneratedItinerary(value: unknown): value is GeneratedItinerary {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GeneratedItinerary>;

  return (
    typeof candidate.tripTitle === "string" &&
    typeof candidate.destination === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.bestTimeToVisit === "string" &&
    typeof candidate.estimatedBudget === "string" &&
    Array.isArray(candidate.luxuryTouches) &&
    Array.isArray(candidate.days)
  );
}

function isSavedTrip(value: unknown): value is SavedTrip {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SavedTrip>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.destination === "string" &&
    typeof candidate.createdAt === "string" &&
    isGeneratedItinerary(candidate.itinerary) &&
    isPlannerFormSnapshot(candidate.formSnapshot)
  );
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Review>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.rating === "number" &&
    candidate.rating >= 1 &&
    candidate.rating <= 5 &&
    Number.isInteger(candidate.rating) &&
    typeof candidate.createdAt === "string" &&
    (candidate.comment === undefined || typeof candidate.comment === "string")
  );
}

function createReviewId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `review-${Date.now()}`;
}

function formatSavedTripDate(value: string, formatter: Intl.DateTimeFormat) {
  const savedDate = new Date(value);

  if (Number.isNaN(savedDate.getTime())) {
    return "";
  }

  return formatter.format(savedDate);
}

type PdfLabels = (typeof translations)[Language]["pdfLabels"];
type PdfFontStyle = "normal" | "bold";
type PdfTextColor = [number, number, number];

const pdfFontFamily = "NotoSans";
const pdfFontFiles: Record<PdfFontStyle, { fileName: string; path: string }> = {
  normal: {
    fileName: "NotoSans-Regular.ttf",
    path: "/fonts/NotoSans-Regular.ttf",
  },
  bold: {
    fileName: "NotoSans-Bold.ttf",
    path: "/fonts/NotoSans-Bold.ttf",
  },
};
const polishPdfGlyphCheck = "Wojtyła Calò Włochy podróż dzień najważniejsze Łódź";
const pdfFontCache: Partial<Record<PdfFontStyle, string>> = {};

function getPdfFileName(destination: string) {
  const safeDestination = (destination || "trip")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `wandara-${safeDestination || "trip"}.pdf`;
}

function getUniqueItems(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x4000;
  const chunks: string[] = [];

  for (let index = 0; index < bytes.length; index += chunkSize) {
    let binaryChunk = "";
    const end = Math.min(index + chunkSize, bytes.length);

    for (let byteIndex = index; byteIndex < end; byteIndex += 1) {
      binaryChunk += String.fromCharCode(bytes[byteIndex]);
    }

    chunks.push(binaryChunk);
  }

  return btoa(chunks.join(""));
}

async function loadPdfFont(doc: jsPDF, style: PdfFontStyle) {
  const font = pdfFontFiles[style];
  let base64Font = pdfFontCache[style];

  if (!base64Font) {
    const response = await fetch(font.path);

    if (!response.ok) {
      throw new Error(`Could not load PDF font: ${font.path}`);
    }

    base64Font = arrayBufferToBase64(await response.arrayBuffer());
    pdfFontCache[style] = base64Font;
  }

  doc.addFileToVFS(font.fileName, base64Font);
  doc.addFont(font.fileName, pdfFontFamily, style);
}

async function createPdfDocument() {
  const doc = new jsPDF({ format: "a4", unit: "pt", putOnlyUsedFonts: true });
  let boldStyle: PdfFontStyle = "bold";

  try {
    await loadPdfFont(doc, "normal");
  } catch (error) {
    console.error(
      `PDF Unicode font unavailable. Text such as "${polishPdfGlyphCheck}" cannot be exported reliably.`,
      error,
    );
    throw error;
  }

  try {
    await loadPdfFont(doc, "bold");
  } catch (error) {
    console.warn("PDF bold font unavailable, using regular font.", error);
    boldStyle = "normal";
  }

  doc.setFont(pdfFontFamily, "normal");

  return { doc, boldStyle };
}

async function exportTripToPdf(trip: GeneratedItinerary, labels: PdfLabels) {
  const { doc, boldStyle } = await createPdfDocument();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const footerY = pageHeight - 30;
  const bodyBottomY = footerY - 28;
  let y = 64;
  let pageNumber = 1;

  const fallback = labels.missing;
  const destination = getPdfText(trip.destination, fallback);
  const tripTitle = getPdfText(trip.tripTitle, fallback);
  const days = Array.isArray(trip.days) ? trip.days : [];
  const highlights = getUniqueItems(
    days.flatMap((day) => (Array.isArray(day.highlights) ? day.highlights : [])),
  );
  const foodRecommendations = getUniqueItems(
    trip.foodRecommendations?.length
      ? trip.foodRecommendations
      : days.map((day) => day.dining),
  );
  const travelTips = getUniqueItems(
    trip.travelTips?.length ? trip.travelTips : trip.luxuryTouches,
  );

  function setPdfFont(style: PdfFontStyle = "normal") {
    doc.setFont(pdfFontFamily, style === "bold" ? boldStyle : "normal");
  }

  function getPdfText(value: string | number | undefined, emptyFallback = fallback) {
    const text = String(value ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return text || emptyFallback;
  }

  function drawPageShell() {
    doc.setFillColor(255, 253, 248);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.line(margin, footerY - 12, pageWidth - margin, footerY - 12);

    setPdfFont();
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(labels.preparedBy, margin, footerY);
    doc.text(String(pageNumber), pageWidth - margin, footerY, { align: "right" });
  }

  function drawCoverHeader() {
    setPdfFont("bold");
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text("Wandara", margin, y);

    setPdfFont();
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(labels.brandLine.toUpperCase(), margin, y + 16);

    y += 42;
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(1.1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 46;

    addText(tripTitle, {
      size: 28,
      style: "bold",
      color: [15, 23, 42],
      lineHeight: 34,
    });
    y += 8;
    addText(destination, {
      size: 14,
      style: "bold",
      color: [14, 116, 144],
      lineHeight: 20,
    });
    y += 24;
  }

  function ensureSpace(requiredHeight = 80) {
    if (y + requiredHeight <= bodyBottomY) {
      return;
    }

    doc.addPage();
    pageNumber += 1;
    drawPageShell();
    y = 64;
  }

  function addText(
    text: string,
    options: {
      size?: number;
      style?: PdfFontStyle;
      color?: PdfTextColor;
      indent?: number;
      lineHeight?: number;
      bottomGap?: number;
    } = {},
  ) {
    const {
      size = 10,
      style = "normal",
      color = [51, 65, 85],
      indent = 0,
      lineHeight = size + 5,
      bottomGap = 0,
    } = options;
    const safeText = getPdfText(text);
    setPdfFont(style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const paragraphs = safeText.split("\n");

    paragraphs.forEach((paragraph, paragraphIndex) => {
      const lines = doc.splitTextToSize(paragraph.trim() || fallback, contentWidth - indent);

      lines.forEach((line: string) => {
        ensureSpace(lineHeight + 8);
        setPdfFont(style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });

      if (paragraphIndex < paragraphs.length - 1) {
        y += Math.round(lineHeight * 0.35);
      }
    });

    y += bottomGap;
  }

  function addSectionTitle(title: string) {
    ensureSpace(58);
    y += 18;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.7);
    doc.line(margin, y - 14, pageWidth - margin, y - 14);
    addText(title, {
      size: 13,
      style: "bold",
      color: [15, 23, 42],
      lineHeight: 18,
      bottomGap: 8,
    });
  }

  function addMetaRow(label: string, value: string) {
    ensureSpace(30);
    setPdfFont("bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(label.toUpperCase(), margin, y);

    setPdfFont();
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    const lines = doc.splitTextToSize(getPdfText(value), contentWidth - 156);
    doc.text(lines, margin + 156, y);
    y += Math.max(24, lines.length * 14 + 8);
  }

  function addList(items: string[]) {
    const safeItems = items.length ? items : [fallback];

    safeItems.forEach((item) => {
      ensureSpace(30);
      addText(`- ${item}`, { indent: 8, lineHeight: 15, bottomGap: 3 });
    });
  }

  function addDayField(label: string, value: string) {
    addText(`${label}: ${getPdfText(value)}`, {
      indent: 16,
      lineHeight: 15,
      bottomGap: 2,
    });
  }

  drawPageShell();
  drawCoverHeader();

  addMetaRow(labels.destination, destination);
  addMetaRow(labels.tripTitle, tripTitle);
  addMetaRow(labels.days, days.length.toString());
  addMetaRow(labels.estimatedBudget, trip.estimatedBudget);
  addMetaRow(labels.bestTime, trip.bestTimeToVisit);

  addSectionTitle(labels.overview);
  addText(trip.summary, { size: 11, lineHeight: 17 });

  addSectionTitle(labels.itinerary);
  if (days.length === 0) {
    addText(fallback);
  } else {
    days.forEach((day) => {
      ensureSpace(150);
      addText(`${labels.day} ${day.day || ""}: ${getPdfText(day.title)}`, {
        size: 14,
        style: "bold",
        color: [15, 23, 42],
        lineHeight: 20,
        bottomGap: 4,
      });
      addDayField(labels.morning, day.morning);
      addDayField(labels.afternoon, day.afternoon);
      addDayField(labels.evening, day.evening);
      addDayField(labels.dining, day.dining);
      addDayField(labels.stay, day.stay);
      if (day.highlights?.length) {
        addText(`${labels.highlights}: ${day.highlights.join(", ")}`, {
          style: "bold",
          color: [14, 116, 144],
          indent: 16,
          lineHeight: 15,
        });
      }
      y += 12;
    });
  }

  addSectionTitle(labels.highlights);
  addList(highlights);

  addSectionTitle(labels.food);
  addList(foodRecommendations);

  addSectionTitle(labels.tips);
  addList(travelTips);

  addSectionTitle(labels.luxuryTouches);
  addList(trip.luxuryTouches?.length ? trip.luxuryTouches : []);

  doc.save(getPdfFileName(destination));
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("pl");
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [form, setForm] = useState<PlannerForm>(initialForm);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [hasLoadedSavedTrips, setHasLoadedSavedTrips] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false);
  const [selectedReviewRating, setSelectedReviewRating] = useState(0);
  const [hoveredReviewRating, setHoveredReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [selectedSampleTripIndex, setSelectedSampleTripIndex] = useState<
    number | null
  >(null);
  const languageSwapTimerRef = useRef<number | null>(null);
  const languageTransitionTimerRef = useRef<number | null>(null);

  const t = translations[language];
  const activeLanguage = pendingLanguage ?? language;
  const loadingMessages = t.loadingMessages;
  const loadingMessage = loadingMessages[loadingMessageIndex];
  const travelStyleOptions = Object.entries(t.travelStyles) as [
    TravelStyle,
    string,
  ][];
  const interestOptions = Object.entries(t.interests) as [Interest, string][];
  const selectedSampleTrip =
    selectedSampleTripIndex === null
      ? null
      : (t.sampleItineraries[selectedSampleTripIndex] ?? null);
  const selectedSampleIcon = selectedSampleTrip
    ? getSampleItineraryIcon(selectedSampleTrip)
    : null;
  const selectedSampleArtworkVariant = selectedSampleTrip
    ? getDestinationArtworkVariant([
        selectedSampleTrip.city,
        selectedSampleTrip.title,
        selectedSampleTrip.intro,
        ...selectedSampleTrip.highlights,
      ])
    : "generic";
  const currentTripSaved = itinerary
    ? savedTrips.some((savedTrip) => savedTrip.id === getSavedTripId(itinerary))
    : false;
  const reviewKpis = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: "0.0",
        totalReviews: 0,
        fiveStarPercentage: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const fiveStarReviews = reviews.filter((review) => review.rating === 5);

    return {
      averageRating: (totalRating / reviews.length).toFixed(1),
      totalReviews: reviews.length,
      fiveStarPercentage: Math.round(
        (fiveStarReviews.length / reviews.length) * 100,
      ),
    };
  }, [reviews]);
  const heroStats = [
    {
      value: reviewKpis.totalReviews.toString(),
      label: t.stats.totalReviews,
    },
    {
      value: "128",
      label: t.stats.countries,
    },
    {
      value:
        reviewKpis.totalReviews === 0
          ? "- /5"
          : `${reviewKpis.averageRating}/5`,
      label: t.stats.averageRating,
    },
  ];
  const visibleReviewRating = hoveredReviewRating || selectedReviewRating;
  const savedTripDateFormatter = new Intl.DateTimeFormat(
    language === "pl" ? "pl-PL" : "en-US",
    {
      day: "numeric",
      month: "short",
    },
  );
  const translatedContentClass = `transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
    isLanguageChanging ? "translate-y-1 opacity-60" : "translate-y-0 opacity-100"
  }`;
  const translatedTextClass = `transition-opacity duration-300 ease-out motion-reduce:transition-none ${
    isLanguageChanging ? "opacity-60" : "opacity-100"
  }`;

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const messageTimer = window.setInterval(() => {
      setLoadingMessageIndex(
        (currentIndex) => (currentIndex + 1) % loadingMessages.length,
      );
    }, 1800);

    return () => window.clearInterval(messageTimer);
  }, [isLoading, loadingMessages.length]);

  useEffect(() => {
    return () => {
      if (languageSwapTimerRef.current !== null) {
        window.clearTimeout(languageSwapTimerRef.current);
      }

      if (languageTransitionTimerRef.current !== null) {
        window.clearTimeout(languageTransitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadSavedTripsTimer = window.setTimeout(() => {
      try {
        const savedTripsJson = window.localStorage.getItem(savedTripsStorageKey);

        if (!savedTripsJson) {
          return;
        }

        const parsedTrips = JSON.parse(savedTripsJson) as unknown;

        if (Array.isArray(parsedTrips)) {
          setSavedTrips(parsedTrips.filter(isSavedTrip));
        }
      } catch {
        setSavedTrips([]);
      } finally {
        setHasLoadedSavedTrips(true);
      }
    }, 0);

    return () => window.clearTimeout(loadSavedTripsTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedTrips) {
      return;
    }

    try {
      window.localStorage.setItem(
        savedTripsStorageKey,
        JSON.stringify(savedTrips),
      );
    } catch {
      // Ignore storage quota or privacy-mode failures; the UI still works in memory.
    }
  }, [hasLoadedSavedTrips, savedTrips]);

  useEffect(() => {
    const loadReviewsTimer = window.setTimeout(() => {
      try {
        const reviewsJson = window.localStorage.getItem(reviewsStorageKey);

        if (!reviewsJson) {
          return;
        }

        const parsedReviews = JSON.parse(reviewsJson) as unknown;

        if (Array.isArray(parsedReviews)) {
          setReviews(parsedReviews.filter(isReview));
        }
      } catch {
        setReviews([]);
      } finally {
        setHasLoadedReviews(true);
      }
    }, 0);

    return () => window.clearTimeout(loadReviewsTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedReviews) {
      return;
    }

    try {
      window.localStorage.setItem(reviewsStorageKey, JSON.stringify(reviews));
    } catch {
      // Keep the in-memory review list usable if browser storage is unavailable.
    }
  }, [hasLoadedReviews, reviews]);

  useEffect(() => {
    if (selectedSampleTripIndex === null) {
      return;
    }

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSampleTripIndex(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedSampleTripIndex]);

  function updateField<Field extends Exclude<keyof PlannerForm, "interests">>(
    field: Field,
    value: PlannerForm[Field],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function changeLanguage(nextLanguage: Language) {
    if (nextLanguage === activeLanguage) {
      return;
    }

    setPendingLanguage(nextLanguage);
    setIsLanguageChanging(true);

    if (languageSwapTimerRef.current !== null) {
      window.clearTimeout(languageSwapTimerRef.current);
    }

    if (languageTransitionTimerRef.current !== null) {
      window.clearTimeout(languageTransitionTimerRef.current);
    }

    languageSwapTimerRef.current = window.setTimeout(() => {
      setLanguage(nextLanguage);
      setPendingLanguage(null);
      setError("");
      setReviewError("");
      setLoadingMessageIndex(0);
    }, languageSwapDelayMs);

    languageTransitionTimerRef.current = window.setTimeout(() => {
      setIsLanguageChanging(false);
    }, languageTransitionMs);
  }

  function toggleInterest(interest: Interest) {
    setForm((currentForm) => {
      const isSelected = currentForm.interests.includes(interest);

      return {
        ...currentForm,
        interests: isSelected
          ? currentForm.interests.filter((item) => item !== interest)
          : [...currentForm.interests, interest],
      };
    });
  }

  function openSamplePreview(index: number) {
    setSelectedSampleTripIndex(index);
  }

  function handleSampleCardKeyDown(
    event: KeyboardEvent<HTMLElement>,
    index: number,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSamplePreview(index);
    }
  }

  function handleSaveCurrentTrip() {
    if (!itinerary) {
      return;
    }

    const savedTrip: SavedTrip = {
      id: getSavedTripId(itinerary),
      title: itinerary.tripTitle,
      destination: itinerary.destination,
      createdAt: new Date().toISOString(),
      language,
      formSnapshot: form,
      itinerary,
    };

    setSavedTrips((currentTrips) => {
      const existingTripIndex = currentTrips.findIndex(
        (trip) => trip.id === savedTrip.id,
      );

      if (existingTripIndex === -1) {
        return [savedTrip, ...currentTrips];
      }

      const nextTrips = [...currentTrips];
      nextTrips[existingTripIndex] = {
        ...savedTrip,
        createdAt: currentTrips[existingTripIndex].createdAt,
      };

      return nextTrips;
    });
    setSaveMessage(currentTripSaved ? t.savedTripUpdated : t.savedTripSaved);
  }

  function reopenSavedTrip(savedTrip: SavedTrip) {
    setItinerary(savedTrip.itinerary);
    setForm(savedTrip.formSnapshot);
    setError("");
    setSaveMessage(t.savedTripReopened);

    window.requestAnimationFrame(() => {
      document
        .getElementById("itineraries")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function deleteSavedTrip(savedTripId: string) {
    setSavedTrips((currentTrips) =>
      currentTrips.filter((trip) => trip.id !== savedTripId),
    );

    if (itinerary && getSavedTripId(itinerary) === savedTripId) {
      setSaveMessage("");
    }
  }

  function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedReviewRating === 0) {
      setReviewError(t.reviewValidation);
      return;
    }

    const trimmedComment = reviewComment.trim();
    const review: Review = {
      id: createReviewId(),
      rating: selectedReviewRating,
      comment: trimmedComment || undefined,
      createdAt: new Date().toISOString(),
    };

    setReviews((currentReviews) => [review, ...currentReviews]);
    setSelectedReviewRating(0);
    setHoveredReviewRating(0);
    setReviewComment("");
    setReviewError("");
  }

  function deleteReview(reviewId: string) {
    setReviews((currentReviews) =>
      currentReviews.filter((review) => review.id !== reviewId),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaveMessage("");
    setLoadingMessageIndex(0);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: form.destination,
          budget: form.budget,
          days: Number(form.days),
          style: t.travelStyles[form.style],
          interests: form.interests.map((interest) => t.interests[interest]),
          language,
        }),
      });

      const data = (await response.json()) as GenerateTripResponse;

      if (!response.ok || !data.itinerary) {
        throw new Error(data.error || t.errorFallback);
      }

      setItinerary(data.itinerary);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t.errorFallback,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] font-sans text-white">
      <section className="relative isolate px-6 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.22),transparent_30%),linear-gradient(135deg,#030712_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-pulse" />
        <div className="mx-auto flex max-w-7xl flex-col gap-16">
          <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <a href="#" className="flex items-center gap-3">
              <img
                src="/icon.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full shadow-lg shadow-cyan-500/20"
              />
              <span className="text-lg font-semibold tracking-tight">
                Wandara
              </span>
            </a>
            <div
              className={`hidden items-center gap-6 text-sm leading-5 text-slate-300 md:flex ${translatedTextClass}`}
            >
              {t.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="min-w-16 text-center transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div
                aria-label={t.languageLabel}
                className="flex w-[6.75rem] rounded-full border border-white/10 bg-white/[0.06] p-1 text-xs font-bold text-slate-300 shadow-inner shadow-white/5 backdrop-blur transition duration-300"
                role="group"
              >
                {(["pl", "en"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={activeLanguage === item}
                    onClick={() => changeLanguage(item)}
                    className={`w-12 rounded-full px-3 py-1.5 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 ${
                      activeLanguage === item
                        ? "bg-gradient-to-r from-cyan-200 to-sky-200 text-slate-950 shadow-lg shadow-cyan-500/20"
                        : "hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
              <a
                href="#planner"
                className={`min-w-[8.75rem] rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 ${translatedTextClass}`}
              >
                {t.startPlanning}
              </a>
            </div>
          </nav>

          <div className="grid items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
            <div className={`max-w-3xl ${translatedContentClass}`}>
              <p className="mb-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-950/30">
                {t.heroBadge}
              </p>
              <h1 className="min-h-[10.5rem] text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:min-h-[8rem] sm:text-6xl lg:min-h-[13.5rem] lg:text-7xl">
                {t.heroTitle}
              </h1>
              <p className="mt-6 min-h-24 max-w-2xl text-lg leading-8 text-slate-300 sm:min-h-16">
                {t.heroBody}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#planner"
                  className="min-w-[13rem] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-7 py-4 text-center text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:scale-[1.02]"
                >
                  {t.primaryCta}
                </a>
                <a
                  href="#itineraries"
                  className="min-w-[13rem] rounded-full border border-white/15 bg-white/[0.06] px-7 py-4 text-center text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  {t.secondaryCta}
                </a>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="min-h-28 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur"
                  >
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="planner"
              className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6"
            >
              <form
                onSubmit={handleSubmit}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6"
              >
                <div className={`mb-8 ${translatedContentClass}`}>
                  <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
                    {t.plannerEyebrow}
                  </p>
                  <h2 className="mt-3 min-h-10 text-3xl font-semibold leading-tight">
                    {t.plannerTitle}
                  </h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                    {t.plannerBody}
                  </p>
                </div>

                <div className="grid gap-5">
                  <label className="grid gap-2 text-sm font-medium text-slate-200">
                    {t.destinationLabel}
                    <input
                      type="text"
                      name="destination"
                      value={form.destination}
                      onChange={(event) =>
                        updateField("destination", event.target.value)
                      }
                      placeholder={t.destinationPlaceholder}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                    />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-slate-200">
                      {t.budgetLabel}
                      <input
                        type="text"
                        name="budget"
                        value={form.budget}
                        onChange={(event) =>
                          updateField("budget", event.target.value)
                        }
                        placeholder={t.budgetPlaceholder}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-200">
                      {t.daysLabel}
                      <select
                        name="days"
                        value={form.days}
                        onChange={(event) =>
                          updateField("days", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                      >
                        {[3, 5, 7, 10, 14].map((days) => (
                          <option key={days} value={String(days)}>
                            {t.dayOption(days)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-medium text-slate-200">
                    {t.travelStyleLabel}
                    <select
                      name="style"
                      value={form.style}
                      onChange={(event) =>
                        updateField("style", event.target.value as TravelStyle)
                      }
                      className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                    >
                      {travelStyleOptions.map(([style, label]) => (
                        <option key={style} value={style}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <fieldset className={`grid gap-3 ${translatedTextClass}`}>
                    <legend className="text-sm font-medium text-slate-200">
                      {t.interestsLabel}
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {interestOptions.map(([interest, label]) => {
                        const isSelected = form.interests.includes(interest);

                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm leading-5 transition ${
                              isSelected
                                ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-50 shadow-lg shadow-cyan-950/20"
                                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {error ? (
                    <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
                      {error}
                    </p>
                  ) : null}

                  <div
                    aria-hidden={!isLoading}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      isLoading
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        role="status"
                        aria-live="polite"
                        className={`relative rounded-[1.75rem] border border-cyan-200/20 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.74))] p-5 shadow-2xl shadow-cyan-950/30 ${translatedContentClass}`}
                      >
                        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
                        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                          <div className="relative h-24 w-24 shrink-0">
                            <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-xl motion-safe:animate-pulse" />
                            <div className="absolute inset-2 rounded-full bg-[conic-gradient(from_90deg,rgba(103,232,249,0),rgba(103,232,249,0.95),rgba(196,181,253,0.95),rgba(103,232,249,0))] p-[2px] motion-safe:animate-spin">
                              <div className="h-full w-full rounded-full bg-slate-950" />
                            </div>
                            <div className="absolute inset-6 rounded-full border border-white/15 bg-white/[0.06] shadow-inner shadow-cyan-200/10" />
                            <span className="absolute left-1/2 top-1 -ml-1.5 h-3 w-3 rounded-full bg-cyan-200 shadow-lg shadow-cyan-300/70 motion-safe:animate-ping" />
                            <span className="absolute bottom-4 right-2 h-2.5 w-2.5 rounded-full bg-violet-300 shadow-lg shadow-violet-300/70 motion-safe:animate-pulse" />
                            <span className="absolute left-3 top-16 h-2 w-2 rounded-full bg-sky-200 shadow-lg shadow-sky-300/60 motion-safe:animate-bounce" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
                              {t.loadingEyebrow}
                            </p>
                            <p className="mt-3 min-h-7 text-xl font-semibold leading-7 text-white transition-opacity duration-300">
                              {loadingMessage}
                            </p>
                            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                              {t.loadingHelper}
                            </p>
                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 shadow-lg shadow-cyan-300/30 motion-safe:animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`mt-2 min-h-14 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${translatedTextClass}`}
                  >
                    {isLoading ? loadingMessage : t.generateButton}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section
        id="itineraries"
        className="border-y border-white/10 bg-slate-950 px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className={`max-w-2xl ${translatedContentClass}`}>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-200">
              {itinerary ? t.generatedEyebrow : t.sampleEyebrow}
            </p>
            <h2 className="mt-4 min-h-24 text-4xl font-semibold leading-tight tracking-tight sm:min-h-16 sm:text-5xl">
              {itinerary ? itinerary.tripTitle : t.sampleTitle}
            </h2>
            {itinerary ? (
              <>
                <p className="mt-5 min-h-20 text-base leading-7 text-slate-300">
                  {itinerary.summary}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleSaveCurrentTrip}
                    className="group inline-flex w-fit items-center justify-center gap-3 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-5 py-3 text-sm font-bold text-cyan-50 shadow-lg shadow-cyan-950/20 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-cyan-200/15 hover:shadow-cyan-300/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/15"
                  >
                    <BookmarkPlus
                      aria-hidden="true"
                      className="h-4 w-4 transition duration-300 group-hover:rotate-3"
                      strokeWidth={1.8}
                    />
                    {currentTripSaved ? t.tripSavedButton : t.saveTripButton}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void exportTripToPdf(itinerary, t.pdfLabels);
                    }}
                    className="group inline-flex w-fit items-center justify-center gap-3 rounded-full border border-amber-200/25 bg-amber-200/10 px-5 py-3 text-sm font-bold text-amber-50 shadow-lg shadow-amber-950/20 transition duration-300 hover:-translate-y-0.5 hover:border-amber-200/50 hover:bg-amber-200/15 hover:shadow-amber-300/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/15"
                  >
                    <FileDown
                      aria-hidden="true"
                      className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                    />
                    {t.exportPdfButton}
                  </button>
                  {saveMessage ? (
                    <p className="text-sm leading-6 text-cyan-100">
                      {saveMessage}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          {itinerary ? (
            <div className={translatedContentClass}>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="min-h-32 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100">
                    {t.destinationCard}
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {itinerary.destination}
                  </p>
                </div>
                <div className="min-h-32 rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-100">
                    {t.budgetCard}
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {itinerary.estimatedBudget}
                  </p>
                </div>
                <div className="min-h-32 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                    {t.bestTimeCard}
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {itinerary.bestTimeToVisit}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-xl font-semibold">{t.luxuryTouches}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {itinerary.luxuryTouches.map((touch) => (
                    <span
                      key={touch}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-50"
                    >
                      {touch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {itinerary.days.map((day) => {
                  const DayIcon = getDayIcon(day);
                  const artworkVariant = getDestinationArtworkVariant([
                    form.destination,
                    itinerary.destination,
                    itinerary.tripTitle,
                    itinerary.summary,
                    day.title,
                  ]);

                  return (
                    <article
                      key={day.day}
                      className="group relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-cyan-950/20"
                    >
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                      <DestinationArtwork
                        variant={artworkVariant}
                        className="absolute inset-x-4 bottom-4 z-0 h-36 opacity-[0.35] sm:h-40"
                      />
                      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-lg shadow-cyan-950/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-cyan-200/50 group-hover:shadow-cyan-300/20">
                            <DayIcon
                              aria-hidden="true"
                              className="h-5 w-5 transition duration-300 group-hover:rotate-3"
                              strokeWidth={1.7}
                            />
                          </span>
                          <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-cyan-100">
                            {t.dayLabel} {day.day}
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">
                          {t.generatedStyleLabel}: {t.travelStyles[form.style]}
                        </span>
                      </div>
                      <h3 className="relative z-10 mt-6 min-h-16 text-2xl font-semibold leading-tight">
                        {day.title}
                      </h3>

                      <div className="relative z-10 mt-6 grid gap-4 text-sm leading-6 text-slate-300">
                        <p>
                          <span className="font-semibold text-white">
                            {t.morning}:
                          </span>{" "}
                          {day.morning}
                        </p>
                        <p>
                          <span className="font-semibold text-white">
                            {t.afternoon}:
                          </span>{" "}
                          {day.afternoon}
                        </p>
                        <p>
                          <span className="font-semibold text-white">
                            {t.evening}:
                          </span>{" "}
                          {day.evening}
                        </p>
                        <p>
                          <span className="font-semibold text-white">
                            {t.dining}:
                          </span>{" "}
                          {day.dining}
                        </p>
                        <p>
                          <span className="font-semibold text-white">
                            {t.stay}:
                          </span>{" "}
                          {day.stay}
                        </p>
                      </div>

                      <ul className="relative z-10 mt-6 flex flex-wrap gap-2 text-sm text-slate-200">
                        {day.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="rounded-full bg-white/10 px-3 py-1.5"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`mt-10 grid gap-6 lg:grid-cols-3 ${translatedContentClass}`}>
              {t.sampleItineraries.map((trip, index) => {
                const TripIcon = getSampleItineraryIcon(trip);
                const artworkVariant = getDestinationArtworkVariant([
                  trip.city,
                  trip.title,
                  ...trip.highlights,
                ]);

                return (
                  <article
                    key={`sample-${index}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t.viewSamplePreview}: ${trip.title}`}
                    onClick={() => openSamplePreview(index)}
                    onKeyDown={(event) =>
                      handleSampleCardKeyDown(event, index)
                    }
                    className="group relative min-h-[31rem] cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 shadow-xl shadow-black/20 outline-none transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-950/30 focus-visible:-translate-y-1 focus-visible:border-cyan-200/70 focus-visible:ring-4 focus-visible:ring-cyan-300/15"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-300/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-lg shadow-cyan-950/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-cyan-200/50 group-hover:shadow-cyan-300/20">
                          <TripIcon
                            aria-hidden="true"
                            className="h-5 w-5 transition duration-300 group-hover:rotate-3"
                            strokeWidth={1.7}
                          />
                        </span>
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-cyan-100">
                          {trip.city}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {trip.days}
                      </span>
                    </div>
                    <h3 className="mt-8 min-h-20 text-2xl font-semibold leading-tight">
                      {trip.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {t.estimatedBudgetFrom}{" "}
                      <span className="font-semibold text-white">
                        {trip.budget}
                      </span>
                    </p>
                    <ul className="mt-6 min-h-24 space-y-3 text-sm leading-6 text-slate-300">
                      {trip.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 inline-flex min-w-[9rem] justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition duration-300 group-hover:border-cyan-200/50 group-hover:bg-cyan-200/15">
                      {t.viewSamplePreview}
                    </div>
                    <DestinationArtwork
                      variant={artworkVariant}
                      className="mt-8 h-32"
                    />
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section
        id="reviews"
        className="relative overflow-hidden border-b border-white/10 bg-[#050816] px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-300/10 blur-3xl" />
        <div className={`relative mx-auto max-w-7xl ${translatedContentClass}`}>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                {t.reviewsEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {t.reviewsTitle}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                {t.reviewsBody}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/10 backdrop-blur">
                  <p className="text-3xl font-semibold">
                    {reviewKpis.averageRating}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-cyan-100">
                    {t.reviewsKpis.average}
                  </p>
                </div>
                <div className="rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5 shadow-xl shadow-violet-950/10 backdrop-blur">
                  <p className="text-3xl font-semibold">
                    {reviewKpis.totalReviews}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-violet-100">
                    {t.reviewsKpis.total}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur">
                  <p className="text-3xl font-semibold">
                    {reviewKpis.fiveStarPercentage}%
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-300">
                    {t.reviewsKpis.fiveStar}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
            >
              <fieldset>
                <legend className="text-sm font-semibold text-slate-200">
                  {t.reviewRatingLabel}
                </legend>
                <div
                  className="mt-4 flex gap-2"
                  onMouseLeave={() => setHoveredReviewRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((rating) => {
                    const isActive = rating <= visibleReviewRating;

                    return (
                      <button
                        key={rating}
                        type="button"
                        aria-label={t.starRatingAria(rating)}
                        aria-pressed={selectedReviewRating === rating}
                        onClick={() => {
                          setSelectedReviewRating(rating);
                          setReviewError("");
                        }}
                        onFocus={() => setHoveredReviewRating(rating)}
                        onBlur={() => setHoveredReviewRating(0)}
                        onMouseEnter={() => setHoveredReviewRating(rating)}
                        className={`rounded-2xl border p-3 transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/15 ${
                          isActive
                            ? "border-cyan-200/50 bg-cyan-200/15 text-cyan-100 shadow-lg shadow-cyan-950/20"
                            : "border-white/10 bg-white/[0.05] text-slate-500 hover:border-cyan-200/30 hover:bg-cyan-200/10 hover:text-cyan-100"
                        }`}
                      >
                        <Star
                          aria-hidden="true"
                          className={`h-6 w-6 transition duration-300 ${
                            isActive ? "fill-current" : ""
                          }`}
                          strokeWidth={1.7}
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="mt-6 grid gap-2 text-sm font-medium text-slate-200">
                {t.reviewCommentLabel}
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder={t.reviewCommentPlaceholder}
                  maxLength={240}
                  rows={4}
                  className="resize-none rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                />
              </label>

              {reviewError ? (
                <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
                  {reviewError}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/20 transition duration-300 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/20"
              >
                {t.reviewSubmitButton}
              </button>
            </form>
          </div>

          <div className="mt-10">
            {reviews.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.08] hover:shadow-cyan-950/30"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-300/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <div
                          aria-label={`${review.rating}/5`}
                          className="flex gap-1 text-cyan-100"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                              key={rating}
                              aria-hidden="true"
                              className={`h-4 w-4 ${
                                rating <= review.rating
                                  ? "fill-current"
                                  : "text-slate-600"
                              }`}
                              strokeWidth={1.7}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                          {t.reviewCreatedLabel}{" "}
                          {formatSavedTripDate(
                            review.createdAt,
                            savedTripDateFormatter,
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteReview(review.id)}
                        className="rounded-full border border-white/10 bg-white/[0.05] p-3 text-slate-400 transition duration-300 hover:border-rose-200/40 hover:bg-rose-300/10 hover:text-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/15"
                      >
                        <span className="sr-only">{t.deleteReview}</span>
                        <Trash2
                          aria-hidden="true"
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                    {review.comment ? (
                      <p className="relative z-10 mt-6 text-base leading-7 text-slate-200">
                        {review.comment}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
                  <Star
                    aria-hidden="true"
                    className="h-7 w-7"
                    strokeWidth={1.6}
                  />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">
                  {t.reviewsEmptyTitle}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  {t.reviewsEmptyBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="saved-trips"
        className="relative overflow-hidden border-b border-white/10 bg-[#030712] px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-violet-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className={`grid gap-8 lg:grid-cols-[0.8fr_1.2fr] ${translatedContentClass}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                {t.savedTripsEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {t.savedTripsTitle}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                {t.savedTripsBody}
              </p>
            </div>

            {savedTrips.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {savedTrips.map((savedTrip) => {
                  const SavedTripIcon = getContextualIcon([
                    savedTrip.destination,
                    savedTrip.title,
                    savedTrip.itinerary.summary,
                    ...savedTrip.itinerary.luxuryTouches,
                  ]);
                  const artworkVariant = getDestinationArtworkVariant([
                    savedTrip.destination,
                    savedTrip.title,
                    savedTrip.itinerary.summary,
                  ]);

                  return (
                    <article
                      key={savedTrip.id}
                      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.08] hover:shadow-cyan-950/30"
                    >
                      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-300/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-lg shadow-cyan-950/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-cyan-200/50 group-hover:shadow-cyan-300/20">
                            <SavedTripIcon
                              aria-hidden="true"
                              className="h-5 w-5 transition duration-300 group-hover:rotate-3"
                              strokeWidth={1.7}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cyan-100">
                              {savedTrip.destination}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                              {t.savedTripCreatedLabel}{" "}
                              {formatSavedTripDate(
                                savedTrip.createdAt,
                                savedTripDateFormatter,
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-300">
                          {t.savedTripDays(savedTrip.itinerary.days.length)}
                        </span>
                      </div>

                      <h3 className="relative z-10 mt-6 min-h-16 text-2xl font-semibold leading-tight">
                        {savedTrip.title}
                      </h3>
                      <p className="relative z-10 mt-3 text-sm leading-6 text-slate-400">
                        {t.savedTripBudgetLabel}:{" "}
                        <span className="font-semibold text-white">
                          {savedTrip.itinerary.estimatedBudget}
                        </span>
                      </p>

                      <DestinationArtwork
                        variant={artworkVariant}
                        className="mt-6 h-28"
                      />

                      <div className="relative z-10 mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => reopenSavedTrip(savedTrip)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/20"
                        >
                          <FolderOpen
                            aria-hidden="true"
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                          {t.reopenSavedTrip}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void exportTripToPdf(savedTrip.itinerary, t.pdfLabels);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-3 text-sm font-semibold text-amber-50 transition duration-300 hover:border-amber-200/50 hover:bg-amber-200/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/15"
                        >
                          <FileDown
                            aria-hidden="true"
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                          {t.exportPdfButton}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedTrip(savedTrip.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-300 transition duration-300 hover:border-rose-200/40 hover:bg-rose-300/10 hover:text-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/15"
                        >
                          <Trash2
                            aria-hidden="true"
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                          {t.deleteSavedTrip}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
                  <BookmarkPlus
                    aria-hidden="true"
                    className="h-7 w-7"
                    strokeWidth={1.6}
                  />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">
                  {t.savedTripsEmptyTitle}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  {t.savedTripsEmptyBody}
                </p>
                <a
                  href="#planner"
                  className="mt-6 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-5 py-3 text-sm font-bold text-cyan-50 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-cyan-200/15"
                >
                  {t.primaryCta}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedSampleTrip ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-3 py-4 sm:items-center sm:p-6">
          <style>{`
            @keyframes samplePreviewBackdrop {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes samplePreviewPanel {
              from {
                opacity: 0;
                transform: translateY(18px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            .sample-preview-backdrop {
              animation: samplePreviewBackdrop 180ms ease-out both;
            }

            .sample-preview-panel {
              animation: samplePreviewPanel 240ms ease-out both;
            }

            @media (prefers-reduced-motion: reduce) {
              .sample-preview-backdrop,
              .sample-preview-panel {
                animation: none;
              }
            }
          `}</style>
          <button
            type="button"
            aria-label={t.closePreview}
            onClick={() => setSelectedSampleTripIndex(null)}
            className="sample-preview-backdrop absolute inset-0 bg-slate-950/85 backdrop-blur-xl"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sample-preview-title"
            aria-describedby="sample-preview-intro"
            className={`sample-preview-panel relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/95 shadow-2xl shadow-cyan-950/30 ring-1 ring-cyan-200/10 sm:max-h-[calc(100vh-3rem)] ${translatedContentClass}`}
          >
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
            <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-16 h-60 w-60 rounded-full bg-violet-300/10 blur-3xl" />

            <div className="relative grid gap-5 border-b border-white/10 p-5 sm:p-6 lg:grid-cols-[1fr_15rem]">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
                      {selectedSampleIcon
                        ? createElement(selectedSampleIcon, {
                            "aria-hidden": true,
                            className: "h-5 w-5",
                            strokeWidth: 1.7,
                          })
                        : null}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
                        {t.previewEyebrow}
                      </p>
                      <p className="mt-2 min-w-24 w-fit rounded-full bg-white/10 px-4 py-2 text-center text-sm font-medium text-cyan-100">
                        {selectedSampleTrip.city}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={t.closePreview}
                    onClick={() => setSelectedSampleTripIndex(null)}
                    className="rounded-full border border-white/10 bg-white/[0.06] p-3 text-slate-300 transition hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/15"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>

                <h2
                  id="sample-preview-title"
                  className="mt-6 min-h-24 text-3xl font-semibold leading-tight tracking-tight text-white sm:min-h-20 sm:text-4xl"
                >
                  {selectedSampleTrip.title}
                </h2>
                <p
                  id="sample-preview-intro"
                  className="mt-4 min-h-24 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base"
                >
                  {selectedSampleTrip.intro}
                </p>
              </div>

              <DestinationArtwork
                variant={selectedSampleArtworkVariant}
                className="min-h-36 lg:h-full"
              />
            </div>

            <div className="relative overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="min-h-32 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100">
                    {t.samplePreviewLabels.destination}
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {selectedSampleTrip.city}
                  </p>
                </div>
                <div className="min-h-32 rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-100">
                    {t.samplePreviewLabels.days}
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {selectedSampleTrip.days}
                  </p>
                </div>
                <div className="min-h-32 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                    {t.samplePreviewLabels.budget}
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {selectedSampleTrip.budget}
                  </p>
                </div>
              </div>

              <div className="mt-6 min-h-32 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
                  {t.samplePreviewLabels.style}
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {selectedSampleTrip.tripStyle}
                </p>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                  <h3 className="text-xl font-semibold">
                    {t.samplePreviewLabels.itinerary}
                  </h3>
                  <div className="mt-5 grid gap-4">
                    {selectedSampleTrip.itinerary.map((day) => (
                      <article
                        key={day.day}
                        className="min-h-36 rounded-3xl border border-white/10 bg-slate-900/70 p-4 transition duration-300 hover:border-cyan-200/30 hover:bg-slate-900"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                          <span className="w-fit rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-sm font-semibold text-cyan-50">
                            {t.dayLabel} {day.day}
                          </span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {day.title}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {day.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                    <h3 className="text-lg font-semibold">
                      {t.samplePreviewLabels.highlights}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-50">
                      {selectedSampleTrip.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[2rem] border border-violet-300/20 bg-violet-300/10 p-5">
                    <h3 className="text-lg font-semibold">
                      {t.samplePreviewLabels.food}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-violet-50">
                      {selectedSampleTrip.foodRecommendations.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-200" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
                    <h3 className="text-lg font-semibold">
                      {t.samplePreviewLabels.tips}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                      {selectedSampleTrip.travelTips.map((tip) => (
                        <li key={tip} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <footer className="bg-[#030712] px-6 py-10 sm:px-8 lg:px-12">
        <div
          className={`mx-auto flex max-w-7xl flex-col gap-4 text-sm leading-6 text-slate-400 sm:flex-row sm:items-center sm:justify-between ${translatedTextClass}`}
        >
          <p>{t.footerText}</p>
          <div className="flex gap-5">
            {t.footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="min-w-16 text-center transition hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
