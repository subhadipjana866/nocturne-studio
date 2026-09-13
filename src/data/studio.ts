/**
 * Central studio config. Edit this file to rebrand the entire site —
 * name, copy, nav, services, stats, testimonials, footer. No other file
 * should hardcode studio facts.
 */

export const studio = {
  name: "NOCTURNE",
  fullName: "Nocturne Studio",
  tagline: "Photography for the moments you don't get twice.",
  email: "hello@nocturnestudio.co",
  phone: "+1 (415) 555-0148",
  location: "San Francisco · Available worldwide",
  instagram: "https://instagram.com",
  founded: 2014,
};

export const nav = [
  { label: "Weddings", href: "#weddings" },
  { label: "Portraits", href: "#portraits" },
  { label: "Events", href: "#events" },
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#about" },
];

export const services = [
  {
    id: "weddings",
    label: "Wedding Stories",
    description:
      "Full-day coverage told like a film — the vows, the glances, the hours no one else sees.",
  },
  {
    id: "portraits",
    label: "Portraits",
    description:
      "Editorial portraiture for people who want to look like themselves, only sharper.",
  },
  {
    id: "events",
    label: "Parties & Events",
    description:
      "Launches, galas, milestone nights. We disappear into the room and bring back the truth of it.",
  },
  {
    id: "commercial",
    label: "Commercial",
    description:
      "Campaign and product photography built for brands that take image seriously.",
  },
];

export const stats = [
  { value: "620+", label: "Weddings shot" },
  { value: "11", label: "Years in the field" },
  { value: "34", label: "Countries worked in" },
  { value: "1.2M", label: "Frames delivered" },
];

export const testimonials = [
  {
    quote:
      "They shot our wedding like they'd known us for years. Every photo still makes my chest tight.",
    name: "Elena & Marcus",
    role: "Wedding, Lake Como",
  },
  {
    quote:
      "The portraits didn't look retouched. They looked like the best version of a Tuesday.",
    name: "Priya Raman",
    role: "Portrait client",
  },
  {
    quote:
      "Our product launch photos ran in three campaigns. Not one reshoot.",
    name: "Daniel Ford",
    role: "Creative Director, Ford & Vale",
  },
];

export const footerColumns = [
  {
    title: "Studio",
    links: [
      { label: "About", href: "#about" },
      { label: "Journal", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Services",
    links: services.map((s) => ({ label: s.label, href: `#${s.id}` })),
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: studio.instagram },
      { label: "Email", href: `mailto:${studio.email}` },
      { label: "Phone", href: `tel:${studio.phone}` },
    ],
  },
];
