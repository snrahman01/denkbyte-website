interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface SiteConfig {
  company: {
    name: string;
    tagline: string;
    founded: number;
  };
  branding: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      dark: string;
      light: string;
      text: string;
      text_light: string;
    };
  };
  contact: {
    email: string;
    linkedin?: string;
    instagram?: string;
    qr?: { linkedin?: string; instagram?: string };
    address: Address;
  };
  legal: {
    /** Real team member named in the Impressum and Privacy Policy (required by the Planspiel rules) */
    contact_person: { name: string; role: string; email: string };
    /** Required wording, shown in the footer of every page */
    disclaimer: string;
  };
}

export interface Service {
  title: string;
  description: string;
  /** Icon name: "ai" | "code" | "chart" | "cloud" | "speed" | "shield" (anything else shows a default icon) */
  icon?: string;
  tags?: string[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  github?: string;
  gitlab?: string;
  linkedin?: string;
}

export interface Update {
  /** ISO date, e.g. "2026-11-05" */
  date: string;
  title: string;
  text: string;
  /** Optional short label, e.g. "Website", "Product", "Team" */
  tag?: string;
}
