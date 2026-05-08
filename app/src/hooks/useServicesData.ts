import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { createService, fetchServices } from "../lib/api";
import { queryClient, queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import type {
  CreateServicePayload,
  Service,
  ServicesSummary,
} from "../types/service";

const emptySummary: ServicesSummary = {
  totalServices: 0,
  averagePrice: 0,
  projectedMargin: 0,
  categories: [],
};

export const useServicesData = ({
  page = 1,
  limit = 10,
  category = "",
  search = "",
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) => {
  const { session } = useAuth();
  const accessToken = session?.tokens.accessToken;

  const query = useQuery({
    queryKey: queryKeys.services.list({ page, limit, category, search }),
    enabled: Boolean(accessToken),
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchServices(accessToken!, { page, limit, category, search }),
  });

  return {
    error: accessToken
      ? query.error instanceof Error
        ? query.error.message
        : null
      : "Session expired. Please sign in again.",
    isLoading: query.isPending,
    isRefreshing:
      query.isRefetching && !query.isPending && !query.isPlaceholderData,
    pagination: query.data?.pagination ?? {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
    services: (query.data?.services ?? []) as Service[],
    refetch: () => query.refetch(),
    summary: (query.data?.summary ?? emptySummary) as ServicesSummary,
  };
};

export const useCreateService = () => {
  const { session } = useAuth();
  const mutation = useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const accessToken = session?.tokens.accessToken;
      if (!accessToken) {
        throw new Error("Session expired. Please sign in again.");
      }
      return createService(accessToken, payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
      ]);
    },
  });

  return {
    createService: mutation.mutateAsync,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isLoading: mutation.isPending,
  };
};
