export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
  type: "profile" | "roadmap" | "recommendation" | "system";
}
