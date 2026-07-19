export interface RoadmapPayload {
  careerGoal: string;
  skills: string[];
  experienceLevel: string;
}

export interface RecommendationPayload {
  skills: string[];
  interests: string[];
  experienceLevel: string;
  education: string;
}

export interface SavedRoadmap {
  _id: string;
  user: string;
  content: string;
  careerGoal: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedRecommendation {
  _id: string;
  user: string;
  content: string;
  careerProfile: {
    skills: string[];
    interests: string[];
    experienceLevel: string;
    education: string;
  };
  createdAt: string;
  updatedAt: string;
}
