export interface Photo {
    id: number;
    advertisementId: number;
    image: string;
    isMain: boolean;
  }
  
  export interface Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    photo: Photo;
    postDate: string;
    price: number;
    status: number;
    userId: number;
    userName: string;
  }
  
  export interface ApiResponse {
    data: {
      $values: Product[];
    };
    success: boolean;
    message: string;
  }