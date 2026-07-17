import type { SiteConfig } from "./types";

// Single source of truth for site-wide identity + About copy.
// Carried over from the previous portfolio where known; AI/role framing is current.
export const site: SiteConfig = {
  name: "Robel Biruk",
  identity: "AI Engineer · Full-Stack Developer · Pharmacy Student",
  location: "Addis Ababa, Ethiopia",
  tagline: "Building intelligent tools at the intersection of code, health, and language.",
  mission:
    "I design and ship AI-first products that feel calm, useful, and human — from a desktop assistant that speaks with you, to ticketing and health platforms serving real communities.",
  currentlyBuilding: [
    "Nira AI — a local-first desktop assistant with voice, reasoning, and tool use",
    "EventHub — Ethiopian-first event ticketing with Chapa payments",
  ],
  currentlyLearning: [
    "Applied LLM agents & tool-calling",
    "Distributed systems & edge inference",
  ],
  email: "natim7520@gmail.com",
  cvUrl: "/cv.pdf",
};
