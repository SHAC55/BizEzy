import React from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Hash,
  Wrench,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useCreateService,
  useService,
  useUpdateService,
} from "../hooks/useServices";

const generateCode = (name) => {
  if (!name) return "";
  const prefix = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 6);
  const random = Math.floor(100 + Math.random() * 900);
  return `SVC-${prefix || "SVC"}-${random}`;
};

const AddServiceForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const isEditMode = Boolean(serviceId);

  const {
    service,
    isLoading: isServiceLoading,
    error: serviceError,
  } = useService(serviceId);
  const {
    createService,
    isLoading: isCreating,
    error: createError,
  } = useCreateService();
  const {
    updateService,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateService();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      costPrice: "",
      price: "",
    },
  });

  const serviceName = watch("name");

  React.useEffect(() => {
    if (isEditMode || !serviceName) return;
    setValue("code", generateCode(serviceName));
  }, [isEditMode, serviceName, setValue]);

  React.useEffect(() => {
    if (!service) return;
    reset({
      name: service.name ?? "",
      code: service.code ?? "",
      costPrice: service.costPrice ?? 0,
      price: service.price ?? "",
    });
  }, [service, reset]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      price: Number(data.price),
      costPrice: data.costPrice === "" ? 0 : Number(data.costPrice),
    };

    const code = data.code?.trim();
    if (code) payload.code = code;

    if (isEditMode) {
      await updateService(serviceId, payload);
    } else {
      await createService(payload);
      reset();
    }

    navigate("/inventory");
  };

  const submitError = createError || updateError || serviceError;
  const isSubmitting = isCreating || isUpdating;

  if (isEditMode && isServiceLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-8 md:ml-20">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-sm">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            {isEditMode ? "Update Service" : "Add New Service"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isEditMode
              ? "Edit service details and pricing"
              : "Define a service you offer to customers"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/inventory")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to inventory
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {submitError && (
            <div className="m-6 mb-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wrench className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("name", {
                      required: "Service name is required",
                    })}
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-300 focus:ring-gray-200 focus:border-gray-500"
                    }`}
                    placeholder="e.g. Haircut, Phone Repair, Consultation"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Code with regenerate */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Service Code
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...register("code")}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all"
                      placeholder="Auto-generated or enter manually"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("code", generateCode(serviceName))}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                  >
                    ↻ Generate
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Unique reference for this service
                </p>
              </div>

              {/* Pricing grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cost Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register("costPrice", {
                        min: {
                          value: 0,
                          message: "Cost cannot be negative",
                        },
                      })}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all appearance-none ${
                        errors.costPrice
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-300 focus:ring-gray-200 focus:border-gray-500"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.costPrice && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.costPrice.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", {
                        required: "Selling price is required",
                        min: {
                          value: 0,
                          message: "Price cannot be negative",
                        },
                      })}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all appearance-none ${
                        errors.price
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-300 focus:ring-gray-200 focus:border-gray-500"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.price.message}
                    </p>
                  )}
                </div>

              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEditMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Update Service" : "Add Service"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;
