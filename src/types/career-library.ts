export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export interface CareerSalary {
  bangladesh: string;
  international: string;
}

export interface ICareerLibrary {
  _id: string;
  title: string;
  image: string;
  industry: string;
  experienceLevel: ExperienceLevel;
  shortDescription: string;
  description: string;
  salary: CareerSalary;
  rating: number;
  skills: string[];
  responsibilities: string[];
  jobOutlook: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCareerLibraryPayload {
  title: string;
  image?: string;
  industry: string;
  experienceLevel: ExperienceLevel;
  shortDescription: string;
  description: string;
  salary?: CareerSalary;
  rating?: number;
  skills: string[];
  responsibilities: string[];
  jobOutlook?: string;
}

export type UpdateCareerLibraryPayload =
  Partial<CreateCareerLibraryPayload>;

export interface CareerLibraryQueryParams {
  search?: string;
  industry?: string;
  experienceLevel?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCareersResult {
  careers: ICareerLibrary[];
  total: number;
  page: number;
  totalPages: number;
}
