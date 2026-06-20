export type PackageFormValues = {
    title: string;
    description: string;
    price: number;
    duration?: number;
    isActive: boolean;
    image?: File | null;
  };