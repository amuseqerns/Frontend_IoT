export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  prologue: string;
  type1: string;
  type2: string;
  type3: string;
  type4: string;
  is_published: boolean;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
}