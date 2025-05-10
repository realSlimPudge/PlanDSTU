export type RoadmapType = {
  practice: Categories;
  lectures: Categories;
  independent_works: Categories;
};

export type Topic = {
  name: string;
  topics: string[];
};

export type Categories = {
  categories: Topic[];
};
