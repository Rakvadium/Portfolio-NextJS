import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Github,
  House,
  LayoutGrid,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { SectionId } from "@/app/data/portfolio";
import type { ChannelKind, FactKind } from "@/app/data/site";

export const channelIcon = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  phone: Phone,
} as const satisfies Record<ChannelKind, LucideIcon>;

export const factIcon = {
  experience: Briefcase,
  location: MapPin,
  recentRole: Building2,
} as const satisfies Record<FactKind, LucideIcon>;

export const sectionIcon = {
  home: House,
  skills: Sparkles,
  experience: BriefcaseBusiness,
  projects: LayoutGrid,
  contact: Send,
} as const satisfies Record<SectionId, LucideIcon>;
