export type ChatMessages = {
  type: "human" | "ai";
  content: string;
};

export type HistoryRes = {
  history: ChatMessages[];
};

export type ChatProps = {
  closeAction: () => void;
  testModalAction: () => void;
};
