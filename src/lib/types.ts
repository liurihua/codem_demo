export type FeedbackStatus = "待处理" | "修改中" | "待确认" | "已完成";

export type Feedback = {
  id: string;
  author: string;
  contact: string;
  content: string;
  status: FeedbackStatus;
  createdAt: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  customer: string;
  summary: string;
  stage: string;
  progress: number;
  updatedAt: string;
  highlights: string[];
  feedback: Feedback[];
};

export type Theme = {
  primary: string;
  accent: string;
};

export type Store = { theme?: Theme; projects: Project[] };
