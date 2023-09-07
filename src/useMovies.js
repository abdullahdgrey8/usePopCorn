import { useEffect, useState } from "react";
const KEY = "edda5023";

export function useMovie(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            {
              signal: controller.signal,
            }
          );
          if (!res.ok) throw new Error("something went wrong");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          // console.log("data i am getting");
          setMovies(data.Search);
          setError("");
          // console.log(data);
          // setIsLoading(false);
        } catch (err) {
          console.log(err.message);
          if (error.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query, error.name]
  );
  return { movies, isLoading, error };
}
