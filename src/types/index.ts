export interface Product {
  id: string;
  number: string;
  name: string;
  description: string;
  tagline?: string;
  features: string[];
  badge: string;
  stack: 'gcloud' | 'ethereum' | 'new';
  icon: string;
  industries?: string[];
  useCases?: string[];
  howItWorks?: string;
  metrics?: string[];
  website?: string;
}

export interface Solution {
  id: string;
  industry: string;
  description: string;
  products: string[];
  icon: string;
}

export interface AriaMessage {
  id: string;
  role: 'user' | 'aria';
  content: string;
  timestamp: Date;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface TechItem {
  name: string;
  description: string;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}
