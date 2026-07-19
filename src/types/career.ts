export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ICareer {
  _id: string;
  user: string;
  careerGoal: string;
  currentRole: string;
  education: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  interests: string[];
  preferredIndustry: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCareerPayload {
  careerGoal: string;
  currentRole?: string;
  education?: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  interests: string[];
  preferredIndustry?: string;
}

export type UpdateCareerPayload = Partial<CreateCareerPayload>;
