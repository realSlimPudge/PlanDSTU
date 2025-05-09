const fetcherPost = (url: string, data: string[]) =>
  fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  }).then((res) => res.json());

export default fetcherPost;
