import { HistoryOfTest } from "@/features/Testing/types";

export type StatsTeacher = {
  reports: Reports[];
  stats: Stats[];
};

type Reports = {
  ID: string;
  DisciplineTitle: string;
  DisciplineID: number;
  Group: string;
  UserID: string;
  DetailsJSONB: Report;
  CreatedAt: string;
};

type Report = {
  report: HistoryOfTest[];
};

type Stats = {
  data: string;
  avg_score: number;
  min_score: number;
  max_score: number;
  reports_count: number;
};
