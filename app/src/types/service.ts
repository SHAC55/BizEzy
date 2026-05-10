export type ServiceCategoryCount = {
  category: string | null;
  count: number;
};

export type Service = {
  id: string;
  businessId: string;
  name: string;
  code: string | null;
  description: string | null;
  category: string | null;
  costPrice: number;
  price: number;
  durationMinutes: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ServicesSummary = {
  totalServices: number;
  averagePrice: number;
  projectedMargin: number;
  categories: ServiceCategoryCount[];
};

export type ServicesResponse = {
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: ServicesSummary;
};

export type CreateServicePayload = {
  name: string;
  code?: string;
  description?: string;
  category?: string;
  costPrice: number;
  price: number;
  durationMinutes?: number;
};

export type UpdateServicePayload = Partial<CreateServicePayload>;
