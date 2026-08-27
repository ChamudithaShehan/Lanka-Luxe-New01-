import type { Localized } from "@/lib/i18n";

import _sigiriya from "@/assets/sigiriya.jpg";
import _beach from "@/assets/beach.jpg";
import _golf from "@/assets/golf.jpg";
import _golf2 from "@/assets/golf2.jpg";
import _wildlife from "@/assets/wildlife.jpg";
import _tea from "@/assets/tea.jpg";
import _resort from "@/assets/resort.jpg";
import _train from "@/assets/train.jpg";
import _culture from "@/assets/culture.jpg";
import _colombo from "@/assets/colombo.jpg";
import _kandy from "@/assets/kandy.jpg";
import _galle from "@/assets/galle.jpg";
import _ella from "@/assets/ella.jpg";
import _honeymoon from "@/assets/honeymoon.jpg";
import _wellness from "@/assets/wellness.jpg";
import _aerial from "@/assets/aerial.jpg";
import _iroshan from "@/assets/iroshan.jpg";
import _showcase from "@/assets/showcase.jpg";
import _logo from "@/assets/logo.png";

const resolveSrc = (image: any): string =>
  image && typeof image === "object" && "src" in image
    ? image.src
    : String(image || "");

const sigiriya = resolveSrc(_sigiriya);
const beach = resolveSrc(_beach);
const golf = resolveSrc(_golf);
const golf2 = resolveSrc(_golf2);
const wildlife = resolveSrc(_wildlife);
const tea = resolveSrc(_tea);
const resort = resolveSrc(_resort);
const train = resolveSrc(_train);
const culture = resolveSrc(_culture);
const colombo = resolveSrc(_colombo);
const kandy = resolveSrc(_kandy);
const galle = resolveSrc(_galle);
const ella = resolveSrc(_ella);
const honeymoon = resolveSrc(_honeymoon);
const wellness = resolveSrc(_wellness);
const aerial = resolveSrc(_aerial);
const iroshan = resolveSrc(_iroshan);
const showcase = resolveSrc(_showcase);
const logo = resolveSrc(_logo);

export const img = {
  sigiriya,
  beach,
  golf,
  golf2,
  wildlife,
  tea,
  resort,
  train,
  culture,
  colombo,
  kandy,
  galle,
  ella,
  honeymoon,
  wellness,
  aerial,
  iroshan,
  showcase,
  logo,
};

export const contact: Record<string, string> = {};

export type Feature = { no: string; title: Localized; text: Localized };

export const whyUs: Feature[] = [];

export type Tour = {
  slug: string;
  name: Localized;
  category: string;
  categories: string[];
  days: number;
  price: string;
  image: string;
  gallery: string[];
  locations: string[];
  short: Localized;
  overview: Localized;
  itinerary: { day: string; title: string; text: string }[];
  included: string[];
  excluded: string[];
  hotels: string[];
  transport: string;
  optional: string[];
};

export const tours: Tour[] = [];

export const tourFilters = [
  "All",
  "Luxury",
  "Golf",
  "Wildlife",
  "Culture",
  "Honeymoon",
  "Family",
  "Wellness",
  "Custom",
];

export type GolfCourse = {
  slug?: string;
  name: string;
  location: string;
  image: string;
  holes: string | number;
  par?: number;
  duration?: string;
  nights: number;
  rounds: number;
  hotel?: string;
  hotelPairing?: string;
  text: Localized;
  features?: string[];
};

export const golfCourses: GolfCourse[] = [];

export type Experience = {
  slug?: string;
  title: Localized;
  text: Localized;
  description?: Localized;
  image: string;
  category?: string;
  duration?: string;
  location?: string;
  highlights?: string[];
};

export const experiences: Experience[] = [];

export type Destination = {
  slug: string;
  name: Localized;
  region: string;
  image: string;
  short: Localized;
  long: Localized;
  best: string[];
  stay: string;
  /** approximate position on the stylised map, in % */
  x: number;
  y: number;
};

export const destinations: Destination[] = [];

export type Testimonial = {
  quote: Localized;
  name: string;
  country: string;
  trip: string;
  image: string;
};

export const testimonials: Testimonial[] = [];

export type TeamMember = { name: string; role: Localized; bio: Localized; image: string };

export const team: TeamMember[] = [];

export type Post = {
  slug: string;
  title: Localized;
  category: string;
  date: string;
  excerpt: Localized;
  image: string;
};

export const posts: Post[] = [];

export const blogCategories = [
  "All",
  "Golf in Sri Lanka",
  "Luxury Travel",
  "Sri Lankan Culture",
  "Wildlife",
  "Travel Tips",
  "Korean Travel Guides",
];
