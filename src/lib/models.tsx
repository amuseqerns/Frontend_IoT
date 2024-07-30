export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
}