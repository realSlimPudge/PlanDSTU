const fetcher = (url: string) =>
  fetch(url, { method: "GET", credentials: "include" }).then((res) =>
    res.json(),
  );

export default fetcher;
