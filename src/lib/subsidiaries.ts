import type { LucideIcon } from 'lucide-react';
import { Truck, Ship, ShoppingBag } from 'lucide-react';

/**
 * Subsidiary companies of the Paraysco Group.
 *
 * `key` matches the translation namespace (both `subcompanies` and
 * `subsidiaries`), `slug` is the public landing-page segment. Brand colours are
 * sampled from each company's logo so the landing pages stay on-brand; the
 * classes are written as literals so Tailwind's content scanner picks them up.
 */
export interface Subsidiary {
  key: 'parayscoExpress' | 'elohimAzar' | 'houseOfPat';
  slug: string;
  logo: string;
  icon: LucideIcon;
  brand: {
    gradient: string;
    accent: string;
    accentText: string;
    accentSoftBg: string;
    accentBorder: string;
  };
}

export const subsidiaries: Subsidiary[] = [
  {
    key: 'parayscoExpress',
    slug: 'paraysco-express',
    logo: '/subcompanies/paraysco-express.jpg',
    icon: Truck,
    brand: {
      gradient: 'from-[#03173f] via-[#062a63] to-[#0a3d8f]',
      accent: '#dbba47',
      accentText: 'text-[#dbba47]',
      accentSoftBg: 'bg-[#dbba47]/10',
      accentBorder: 'border-[#dbba47]/30',
    },
  },
  {
    key: 'elohimAzar',
    slug: 'elohim-azar',
    logo: '/subcompanies/elohim-azar.jpg',
    icon: Ship,
    brand: {
      gradient: 'from-[#0b2b57] via-[#184589] to-[#2f6bb5]',
      accent: '#a4cade',
      accentText: 'text-[#a4cade]',
      accentSoftBg: 'bg-[#a4cade]/10',
      accentBorder: 'border-[#a4cade]/30',
    },
  },
  {
    key: 'houseOfPat',
    slug: 'house-of-pat',
    logo: '/subcompanies/house-of-pat.jpg',
    icon: ShoppingBag,
    brand: {
      gradient: 'from-[#3d2340] via-[#7a4f80] to-[#b48cba]',
      accent: '#f0dff2',
      accentText: 'text-[#b48cba]',
      accentSoftBg: 'bg-[#b48cba]/10',
      accentBorder: 'border-[#b48cba]/30',
    },
  },
];

export function getSubsidiary(slug: string): Subsidiary | undefined {
  return subsidiaries.find((s) => s.slug === slug);
}

export function getSubsidiaryPath(locale: string, slug: string): string {
  return `/${locale}/subsidiaries/${slug}`;
}
