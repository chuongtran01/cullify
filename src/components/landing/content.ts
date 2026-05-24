import {
  CheckCircle2,
  Download,
  Eye,
  FolderOpen,
  Layers3,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const navLinks = ["Features", "How It Works", "Pricing", "Demo"];

export const featureBullets = [
  "Blur detection",
  "Similar photo grouping",
  "AI best-shot selection",
];

export const stats = [
  { value: "2M+", label: "photos processed" },
  { value: "91%", label: "faster first pass" },
  { value: "4.8/5", label: "review confidence" },
];

export type IconContent = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const steps: IconContent[] = [
  {
    icon: Upload,
    title: "Upload photos",
    description:
      "Drop a full batch into Cullify and keep working while previews and metadata are prepared.",
  },
  {
    icon: WandSparkles,
    title: "AI analyzes and groups",
    description:
      "Blur, similarity, duplicate, and aesthetic signals are combined into clean review groups.",
  },
  {
    icon: CheckCircle2,
    title: "Select your best shots",
    description:
      "Review each cluster with the recommended keepers pinned where your eye lands first.",
  },
];

export const features = [
  {
    icon: Eye,
    title: "Blur Detection",
    description:
      "Cullify flags soft, shaky, and out-of-focus shots before they slow down your review.",
    preview: "sharpness scan",
  },
  {
    icon: Layers3,
    title: "Duplicate Removal",
    description:
      "Near-identical frames are gathered into one decision so you can avoid repetitive picking.",
    preview: "duplicate set",
  },
  {
    icon: FolderOpen,
    title: "Smart Clustering",
    description:
      "Photos with the same scene, pose, background, or composition are grouped automatically.",
    preview: "scene cluster",
  },
  {
    icon: Sparkles,
    title: "AI Best Pick",
    description:
      "A weighted score highlights the strongest image in each group with a clear reason.",
    preview: "ai pick",
  },
  {
    icon: Zap,
    title: "Fast Batch Processing",
    description:
      "Progress stages keep large uploads legible while the analysis pipeline does the heavy pass.",
    preview: "batch queue",
  },
  {
    icon: Download,
    title: "Download Selected Photos",
    description:
      "Export the final keepers after review, with rejected frames left out of the handoff.",
    preview: "keeper export",
  },
];

export const useCases = [
  {
    title: "Photographers",
    description:
      "Cut down wedding, portrait, and event selects before the detailed edit begins.",
  },
  {
    title: "Content Creators",
    description:
      "Find the cleanest frames from shoots, thumbnails, travel days, and campaign batches.",
  },
  {
    title: "Travelers",
    description:
      "Turn hundreds of similar trip photos into a smaller set worth sharing and saving.",
  },
  {
    title: "Ecommerce",
    description:
      "Group product angles, reject soft images, and keep catalog review moving.",
  },
  {
    title: "Teams",
    description:
      "Standardize first-pass selects so creative teams spend less time debating duplicates.",
  },
];

export const benefits = [
  "Save hours sorting photos",
  "Reduce decision fatigue",
  "Organize large batches instantly",
  "Never miss the best shot",
];

export const pricing = [
  {
    name: "Free Trial",
    price: "$0",
    description: "For testing the workflow on a small batch.",
    items: ["250 uploads", "7-day storage", "Basic AI grouping"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$18",
    description: "For regular creators and photographers.",
    items: ["10,000 uploads / month", "60-day storage", "Best-shot ranking"],
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    description: "For shared review and production teams.",
    items: ["50,000 uploads / month", "Shared projects", "Priority processing"],
    featured: false,
  },
];

export const faqs = [
  {
    question: "How does AI grouping work?",
    answer:
      "Cullify compares visual embeddings, capture timing, and quality signals to cluster photos that look like the same scene, pose, or composition.",
  },
  {
    question: "Are my photos private?",
    answer:
      "The planned production system stores uploads in private object storage and keeps project access tied to the signed-in account.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "The MVP should start with common web formats such as JPG, PNG, and HEIC-compatible upload paths where the browser supports them.",
  },
  {
    question: "How long are uploads stored?",
    answer:
      "Storage retention will be plan-based. The product plan starts with temporary storage for trial projects and longer retention for paid plans.",
  },
];
