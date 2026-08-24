"use client";

import { useMemo, useState } from "react";

export function useClientTable<T>(
  data: T[],
  searchFn: (item: T, query: string) => boolean,
  pageSize = 8
) {
  const [search, setSearchRaw] = useState("");
  const [page, setPage] = useState(1);

  const setSearch = (value: string) => {
    setSearchRaw(value);
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((item) => searchFn(item, q));
  }, [data, search, searchFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return { search, setSearch, page: currentPage, setPage, totalPages, paged };
}