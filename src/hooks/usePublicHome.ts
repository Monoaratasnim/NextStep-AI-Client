import { useQuery } from "@tanstack/react-query";
import { careerLibraryService } from "@/services/career-library.service";

export function usePublicStats() {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: careerLibraryService.getPublicStats,
  });
}

export function useIndustryDistribution() {
  return useQuery({
    queryKey: ["industry-distribution"],
    queryFn: careerLibraryService.getIndustryDistribution,
  });
}
