export interface Photo {
    id: number;
    advertisementId: number;
    image: string;
    isMain: boolean;
  }

  export interface ProductDetails {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    categoryName: string;
    price: number;
    postDate: string;
    dueDate: string;
    status: number;
    photos: Photo[];
    userId: number;
    userName: string;
  }  