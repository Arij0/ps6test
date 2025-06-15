export interface Quiz {
  id?: string; // facultatif car généré par le backend
  title: string;
  description?: string;
  category: string;
  imageUrl?: string; 

}
