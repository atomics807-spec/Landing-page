// Database Types for Supabase

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  title_en: string;
  title_fr: string;
  description: string;
  description_en: string;
  description_fr: string;
  price: number;
  location: string;
  location_en: string;
  location_fr: string;
  category: 'residential' | 'commercial' | 'land' | 'industrial';
  status: 'available' | 'sold' | 'reserved' | 'archived';
  bedrooms?: number;
  bathrooms?: number;
  area_sqm: number;
  features: string[];
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  excerpt_en: string;
  excerpt_fr: string;
  content: string;
  content_en: string;
  content_fr: string;
  featured_image: string;
  author_id: string;
  category_id: string;
  tags: string[];
  published: boolean;
  reading_time: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  author?: TeamMember;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Consultant {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  title: string;
  title_en: string;
  title_fr: string;
  bio: string;
  bio_en: string;
  bio_fr: string;
  image_url: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  specialization: string[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  title: string;
  title_en: string;
  title_fr: string;
  bio: string;
  bio_en: string;
  bio_fr: string;
  image_url: string;
  role: 'founder' | 'co-founder' | 'executive' | 'manager' | 'staff';
  department?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description: string;
  description_en: string;
  description_fr: string;
  icon?: string;
  image_url?: string;
  features: string[];
  features_en: string[];
  features_fr: string[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Subcompany {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description: string;
  description_en: string;
  description_fr: string;
  logo_url?: string;
  website_url?: string;
  services: SubcompanyService[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SubcompanyService {
  id: string;
  subcompany_id: string;
  name: string;
  name_en: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_fr: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribed: boolean;
  confirmed: boolean;
  confirmation_token?: string;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  is_default: boolean;
  is_active: boolean;
  order: number;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  group: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_name_en: string;
  client_name_fr: string;
  company?: string;
  company_en?: string;
  company_fr?: string;
  content: string;
  content_en: string;
  content_fr: string;
  image_url?: string;
  rating: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  title: string;
  title_en: string;
  title_fr: string;
  slug: string;
  description: string;
  description_en: string;
  description_fr: string;
  requirements: string[];
  requirements_en: string[];
  requirements_fr: string[];
  location: string;
  location_en: string;
  location_fr: string;
  salary_range?: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  department: string;
  published: boolean;
  closing_date?: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  question_en: string;
  question_fr: string;
  answer: string;
  answer_en: string;
  answer_fr: string;
  category?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface MediaLibrary {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  alt_text?: string;
  folder?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: string;
  created_at: string;
}

// Component Types
export interface NavItem {
  label: string;
  label_en: string;
  label_fr: string;
  href: string;
  children?: NavItem[];
  badge?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  title_en: string;
  title_fr: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_fr: string;
  background_image: string;
  cta_text: string;
  cta_text_en: string;
  cta_text_fr: string;
  cta_link: string;
  order: number;
}

export interface Statistics {
  id: string;
  label: string;
  label_en: string;
  label_fr: string;
  value: string;
  suffix?: string;
  icon?: string;
  order: number;
}

export interface Partner {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  order: number;
}

export interface CompanyTimeline {
  id: string;
  year: string;
  title: string;
  title_en: string;
  title_fr: string;
  description: string;
  description_en: string;
  description_fr: string;
  order: number;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  privacy_policy: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirm_password: string;
  token: string;
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
