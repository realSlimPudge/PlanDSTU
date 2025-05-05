export type TestingProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  firstTest: boolean;
};

export type TestResponse = {
  test: Theme[];
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

export const MOCKTEST: TestResponse = {
  test: [
    {
      title: "penis",
      questions: [
        {
          text: "peni",
          options: [
            {
              label: "A",
              text: "The ability to inherit properties from a parent class.",
            },
            {
              label: "B",
              text: "Bundling data and methods that operate on that data within a class, preventing direct external access.",
            },
            {
              label: "C",
              text: "The process of creating multiple instances of a class.",
            },
            {
              label: "D",
              text: "The ability to create variables that can be accessed from anywhere in the program.",
            },
          ],
        },
        {
          text: "What is a 'class' in Object-Oriented Programming?",
          options: [
            {
              label: "A",
              text: "An instance of an object.",
            },
            {
              label: "B",
              text: "A blueprint or template for creating objects.",
            },
            {
              label: "C",
              text: "A type of variable used to store data.",
            },
            {
              label: "D",
              text: "A function that performs a specific task.",
            },
          ],
        },
        {
          text: "What does 'inheritance' allow a class to do?",
          options: [
            {
              label: "A",
              text: "Create new objects from scratch.",
            },
            {
              label: "B",
              text: "Reuse properties and methods from an existing class, extending or modifying them.",
            },
            {
              label: "C",
              text: "Directly access private variables of another class.",
            },
            {
              label: "D",
              text: "Remove variables from a class.",
            },
          ],
        },
      ],
    },
    {
      title: "OOP",
      questions: [
        {
          text: "Which of the following best describes the concept of 'encapsulation' in Object-Oriented Programming?",
          options: [
            {
              label: "A",
              text: "The ability to inherit properties from a parent class.",
            },
            {
              label: "B",
              text: "Bundling data and methods that operate on that data within a class, preventing direct external access.",
            },
            {
              label: "C",
              text: "The process of creating multiple instances of a class.",
            },
            {
              label: "D",
              text: "The ability to create variables that can be accessed from anywhere in the program.",
            },
          ],
        },
        {
          text: "What is a 'class' in Object-Oriented Programming?",
          options: [
            {
              label: "A",
              text: "An instance of an object.",
            },
            {
              label: "B",
              text: "A blueprint or template for creating objects.",
            },
            {
              label: "C",
              text: "A type of variable used to store data.",
            },
            {
              label: "D",
              text: "A function that performs a specific task.",
            },
          ],
        },
        {
          text: "What does 'inheritance' allow a class to do?",
          options: [
            {
              label: "A",
              text: "Create new objects from scratch.",
            },
            {
              label: "B",
              text: "Reuse properties and methods from an existing class, extending or modifying them.",
            },
            {
              label: "C",
              text: "Directly access private variables of another class.",
            },
            {
              label: "D",
              text: "Remove variables from a class.",
            },
          ],
        },
      ],
    },
  ],
};
