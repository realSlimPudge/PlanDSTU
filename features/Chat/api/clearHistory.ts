import host from "@/shared/host";

export default async function clearHistory() {
  fetch(`${host}/llm/clear_history`, {
    method: "GET",
    credentials: "include",
  });
}
