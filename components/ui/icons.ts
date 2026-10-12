// Icons keyed by meaning, so a new channel or fact kind without an icon fails tsc.
import { Briefcase, Building2, Github, Linkedin, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
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
