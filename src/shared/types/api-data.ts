export type ApiOffer = {
  title: string;
  description: string;
  city: string;
  previewImage: string;
  images: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  type: string;
  rooms: number;
  guests: number;
  price: number;
  amenities: string[];
  latitude: number;
  longitude: number;
};
