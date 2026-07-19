import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { careerLibraryService } from "@/services/career-library.service";
import type {
  CreateCareerLibraryPayload,
  UpdateCareerLibraryPayload,
  CareerLibraryQueryParams,
} from "@/types/career-library";

export function useCareers() {
  return useQuery({
    queryKey: ["career-library"],
    queryFn: careerLibraryService.getAll,
  });
}

export function usePublicCareers(params: CareerLibraryQueryParams) {
  return useQuery({
    queryKey: ["career-library", "search", params],
    queryFn: () => careerLibraryService.search(params),
  });
}

export function useCareer(id: string) {
  return useQuery({
    queryKey: ["career-library", id],
    queryFn: () => careerLibraryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCareerLibraryPayload) =>
      careerLibraryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-library"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useUpdateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCareerLibraryPayload;
    }) => careerLibraryService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-library"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useDeleteCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => careerLibraryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-library"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
