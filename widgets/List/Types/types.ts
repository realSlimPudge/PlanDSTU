export type Falculty = {
  id: string;
  title: string;
};

export type FacultyInfo = {
  id: string;
  title: string;
  directions: FacultyDirection[];
};

export type FacultyDirection = {
  name: string;
};
