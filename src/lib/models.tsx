export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  description: string;
  synopsis: string;
  category: string;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface Order {
  id: number;
  menu_id: number;
  quantity: number;
  status: string;
  note: string;
  menu_name: string;
}