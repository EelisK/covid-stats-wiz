export interface NewsArticle {
  countrySlug: string | null;
  userId: string;
  date: string;
  title: string; // Markdown
  description: string; // Markdown
}
