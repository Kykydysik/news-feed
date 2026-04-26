import { useRef, useState, useEffect } from "react";
import { useLoadNews as useLoadNewsRequest } from "~/modules/news/service";
import { socketService } from "~/shared/api/socket-server";
import type { NewsItem } from "~/modules/news/types";

export const useLoadNews = () => {
  const sortItems: {
    name: string;
    code: "ASC" | "DESC";
  }[] = [
    { name: "Новые", code: "DESC" },
    { name: "Старые", code: "ASC" },
  ];
  const [currentSort, setCurrentSort] = useState<"ASC" | "DESC">(
    sortItems[0].code,
  );
  const [newsFromWS, setNewsFromWS] = useState<NewsItem[]>([]);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useLoadNewsRequest(currentSort);

  const fetchLockRef = useRef(false);
  const lastTriggeredLenRef = useRef<number>(-1);
  const allRows = data
    ? [...newsFromWS, ...data.pages.flatMap((d) => d.items)]
    : [];

  const onLazyLoad = (event: { first: number; last: number }) => {
    if (!hasNextPage) return;
    if (isFetchingNextPage || fetchLockRef.current) return;

    const reachedEndOfLoaded = event.last >= allRows.length - 1;
    if (!reachedEndOfLoaded) return;

    if (lastTriggeredLenRef.current === allRows.length) return;

    lastTriggeredLenRef.current = allRows.length;
    fetchLockRef.current = true;
    void fetchNextPage().finally(() => {
      fetchLockRef.current = false;
    });
  };

  useEffect(() => {
    const unsubscribe = socketService.on(
      "news-added",
      (payload: NewsItem[]) => {
        setNewsFromWS(payload);
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    onLazyLoad,
    data,
    currentSort,
    setCurrentSort,
    sortItems,
    allRows,
  };
};
