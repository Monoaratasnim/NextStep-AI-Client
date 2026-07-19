import {
  LayoutDashboard,
  User,
  Map,
  Lightbulb,
  Sparkles,
  Users,
  PlusCircle,
} from "lucide-react";

export interface SearchItem {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  keywords: string[];
}

export const searchItems: SearchItem[] = [
  {
    label: "Dashboard",
    description: "Overview of your career journey",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords: ["home", "overview", "stats", "main"],
  },
  {
    label: "Career Profile",
    description: "Manage your career goals and skills",
    href: "/career-profile",
    icon: User,
    keywords: ["skills", "goals", "resume", "cv", "experience"],
  },
  {
    label: "Career Roadmap",
    description: "AI-generated learning path",
    href: "/roadmap",
    icon: Map,
    keywords: ["roadmap", "learning", "plan", "path", "generate"],
  },
  {
    label: "Recommendations",
    description: "Personalized AI career advice",
    href: "/recommendation",
    icon: Lightbulb,
    keywords: ["recommend", "advice", "suggestion", "career"],
  },
  {
    label: "My Profile",
    description: "View your account information",
    href: "/profile",
    icon: User,
    keywords: ["account", "profile", "info", "user"],
  },
  {
    label: "Generate Roadmap",
    description: "Create a new AI career roadmap",
    href: "/roadmap",
    icon: Sparkles,
    keywords: ["generate", "create", "new", "roadmap", "ai"],
  },
  {
    label: "Get Recommendations",
    description: "Get AI career recommendations",
    href: "/recommendation",
    icon: Sparkles,
    keywords: ["generate", "get", "new", "recommendation", "ai"],
  },
];

export const adminSearchItems: SearchItem[] = [
  {
    label: "Manage Careers",
    description: "View and manage all user career profiles",
    href: "/dashboard/manage-careers",
    icon: Users,
    keywords: ["manage", "careers", "users", "admin", "all"],
  },
  {
    label: "Add Career",
    description: "Create a new career profile for a user",
    href: "/dashboard/add-career",
    icon: PlusCircle,
    keywords: ["add", "create", "new", "career", "profile"],
  },
];
