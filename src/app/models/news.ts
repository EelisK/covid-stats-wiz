export interface NewsArticle {
  countrySlug: string | null;
  userId: string;
  date: Date;
  title: string; // Markdown
  description: string; // Markdown
}
