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
  icon: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  superhero?: string;
  superpower?: string;
  avatar?: string;
}
