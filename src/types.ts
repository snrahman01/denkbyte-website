export interface Address {
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
    address: Address;
  };
  legal: {
    impressum: { owner: string; responsible: string };
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
  email?: string;
  github?: string;
  gitlab?: string;
  linkedin?: string;
}
