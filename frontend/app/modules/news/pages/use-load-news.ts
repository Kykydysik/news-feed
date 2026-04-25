import { useRef, useState } from "react";
import { useLoadNews as useLoadNewsRequest } from "~/modules/news/service";

export const useLoadNews = () => {
  const sortItems: {
    name: string;
    code: 'ASC' | 'DESC'
  }[] = [
    { name: 'Новые', code: 'DESC' },
    { name: 'Старые', code: 'ASC' },
  ]
  const [currentSort, setCurrentSort] = useState<'ASC' | 'DESC'>(sortItems[0].code)

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useLoadNewsRequest(currentSort)

  const fetchLockRef = useRef(false);
  const lastTriggeredLenRef = useRef<number>(-1);
  const allRows = data ? data.pages.flatMap((d) => d.items) : []

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

  return {
    onLazyLoad,
    data,
    currentSort,
    setCurrentSort,
    sortItems,
    allRows
  }
}