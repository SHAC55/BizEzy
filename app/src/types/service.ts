export type Service = {
  id: string;
  businessId: string;
  name: string;
  code: string | null;
  costPrice: number;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type ServicesSummary = {
  totalServices: number;
  averagePrice: number;
  projectedMargin: number;
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
  costPrice: number;
  price: number;
};

export type UpdateServicePayload = Partial<CreateServicePayload>;
