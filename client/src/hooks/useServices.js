import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDeferredValue } from "react";
import toast from "react-hot-toast";
import {
  createServiceAPI,
  deleteServiceAPI,
  getServiceAPI,
  getServicesAPI,
  updateServiceAPI,
} from "../api/service.api";
import { mapListItems, updateMatchingQueries } from "../lib/queryCacheUtils";
import { saleKeys, serviceKeys } from "../lib/queryKeys";

const emptySummary = {
  totalServices: 0,
  averagePrice: 0,
  projectedMargin: 0,
  categories: [],
};

export const useServices = (params = {}) => {
  const { page = 1, limit = 10, category = "", search = "" } = params;
  const deferredSearch = useDeferredValue(search);
  const queryParams = {
    page,
    limit,
    category,
    search: deferredSearch,
  };

  const query = useQuery({
    queryKey: serviceKeys.list(queryParams),
    queryFn: () => getServicesAPI(queryParams),
    staleTime: 2 * 60 * 1000,
  });

  return {
    services: query.data?.services ?? [],
    pagination: query.data?.pagination ?? {
      page: 1,
      limit,
      total: 0,
      totalPages: 0,
    },
    summary: query.data?.summary ?? emptySummary,
    isLoading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useService = (serviceId) => {
  const query = useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => getServiceAPI(serviceId),
    enabled: Boolean(serviceId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    service: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || null,
  };
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createServiceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success("Service created");
    },
  });

  return {
    createService: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error:
      mutation.error?.response?.data?.message || mutation.error?.message || null,
  };
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ serviceId, data }) => updateServiceAPI(serviceId, data),
    onMutate: async ({ serviceId, data }) => {
      await queryClient.cancelQueries({ queryKey: serviceKeys.all });

      const previousService = queryClient.getQueryData(
        serviceKeys.detail(serviceId),
      );
      const previousLists = queryClient.getQueriesData({
        queryKey: serviceKeys.lists(),
      });

      if (previousService) {
        queryClient.setQueryData(serviceKeys.detail(serviceId), {
          ...previousService,
          ...data,
        });
      }

      updateMatchingQueries(queryClient, serviceKeys.lists(), (currentData) =>
        mapListItems(currentData, "services", (service) =>
          service.id === serviceId ? { ...service, ...data } : service,
        ),
      );

      return { previousService, previousLists };
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(variables.serviceId),
      });
      toast.success("Service updated");
    },
    onError: (_error, variables, context) => {
      if (context?.previousService) {
        queryClient.setQueryData(
          serviceKeys.detail(variables.serviceId),
          context.previousService,
        );
      }

      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
  });

  return {
    updateService: (serviceId, data) =>
      mutation.mutateAsync({ serviceId, data }),
    isLoading: mutation.isPending,
    error:
      mutation.error?.response?.data?.message || mutation.error?.message || null,
  };
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteServiceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
      toast.success("Service deleted");
    },
  });

  return {
    deleteService: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error:
      mutation.error?.response?.data?.message || mutation.error?.message || null,
  };
};
