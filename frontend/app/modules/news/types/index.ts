export interface NewsItem {
  id: string;
  title: string;
  news_text: string;
  created_at: Date;
  image: string;
  // author: User;
}

export interface CreateNewsItemParams {
  title: string;
  news_text: string;
  image?: string;
}
