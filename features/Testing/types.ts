export type TestingProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  test: Theme[] | null;
  testId: string | null;
  revalidateAction: () => void;
};

export type TestResponse = {
  test: Theme[];
  id: string;
};

export type Theme = {
  title: string;
  questions: Question[];
};
export type Question = {
  text: string;
  options: Options[];
};

export type Options = {
  label: string;
  text: string;
};

//Проверка первичного тестирования
export type FirstTest = {
  roadmap_history: RoadmapHistory;
  error?: "У пользователя нет истории";
};

export type RoadmapHistory = {
  BlocksJSONB: Blocks;
  CreatedAt: string;
  DisciplineID: number;
  ID: string;
  Tests: Tests[];
  UserID: string;
};

export type Tests = {
  CreatedAt: string;
  ID: string;
  IsFirst: boolean;
  DetailsJSONB: TestResponse;
  PassedAt: string;
  RoadmapHistoryID: string;
  Status: "pending";
};

export type Blocks = {
  blocks: Grade[];
};

export type Grade = {
  name: string;
  value: number;
};
// test_results = [{ name: string, grade: number }, {}, {}...]
