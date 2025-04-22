//Факультет
export type Faculty = {
  id: string;
  title: string;
};

//Факультет подробно
export type FacultyInfo = {
  id: string;
  title: string;
  directions: FacultyDirection[];
};

//Направление факультета
export type FacultyDirection = {
  name: string;
};

//Дисцпилины направления
export type Discipline = {
  name: string;
  course: string;
  semester: string;
  link: string;
};
