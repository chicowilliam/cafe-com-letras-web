export type UnitName = 'Savassi' | 'Liberdade';
export interface Unit { unity_id: number; unity_unity: UnitName }
export interface Config { config_unity: number; config_address_1: string; config_address_2: string; config_address_3: string; config_time_1: string; config_time_2: string; config_time_3: string; config_phone_1: string; config_phone_2: string }
export interface Artist { artist_id: number; artist_name: string; artist_release: string }
export interface CalendarEvent { calendar_id: number; calendar_unity: number; calendar_date: string; calendar_time: string; calendar_artist: number; calendar_price: string }
export interface Suggestion { suggestion_id: number; suggestion_unity: number; suggestion_date_start: string; suggestion_date_end: string; suggestion_suggestion: string; suggestion_obs: string }
export interface PublicData {
  exportedAt: string; canonicalOrigin: string; source: string;
  units: Unit[]; configs: Config[]; artists: Artist[]; events: CalendarEvent[];
  about: { about_id: number; about_about: string }[];
  highlights: { highlight_id: number; highlight_unity: number; highlight_order: number; highlight_link: string }[];
  photos: { photo_id: number; photo_unity: number }[];
  news: { news_id: number; news_title: string; news_news: string; news_link: string }[];
  links: { linktree_id: number; linktree_order: number; linktree_label: string; linktree_url: string }[];
  social: { social_facebook: string; social_twitter: string; social_instagram: string; social_soundcloud: string }[];
  categories: { category_id: number; category_category: string }[];
  items: { item_id: number; item_unity: number; item_category: number; item_item: string; item_description: string; item_price: string }[];
  suggestions: Suggestion[]; plates: { plate_id: number; plate_plate: string }[];
  suggestionRelations: { suggestionrel_suggestion: number; suggestionrel_plate: number; suggestionrel_order: number; suggestionrel_price: string }[];
}
export interface CalendarChunk { events: CalendarEvent[]; artists: Artist[] }
export interface PageSnapshot { key: string; unit: UnitName; kind: string; body: string; css: string[] }
