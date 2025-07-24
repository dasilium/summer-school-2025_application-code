export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  ingredients: {
    quantity: string;
    name: string;
  }[];
  steps: { text: string }[];
  notes?: string;
}
