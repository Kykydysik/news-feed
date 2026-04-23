import { useLoadNews } from "~/modules/news/service";
import { useRef, useState } from "react";
import { VirtualScroller } from 'primereact/virtualscroller';
import NewsItem from "~/modules/news/pages/news-item/NewsItem";
import type { NewsItem as NewsItemType } from "~/modules/news/types";
import NewsDialog from "~/modules/news/pages/news-dialog/NewsDialog";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';

export default function NewsFeed() {
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
  } = useLoadNews(currentSort)
  const [ selectedNews, setSelectedNews ] = useState<NewsItemType | null>(null)
  const [ isDialogOpen, setDialogOpen ] = useState<boolean>(false)
  const allRows = data ? data.pages.flatMap((d) => d.items) : []

  const fetchLockRef = useRef(false);
  const lastTriggeredLenRef = useRef<number>(-1);

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

  const selectNews = (item: NewsItemType) => {
    setSelectedNews(item)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedNews(null)
  }

  if (!data) return <>Loading...</>;

  return (
      <>
        <span className="font-bold block mb-2 text-center text-2xl">Список новостей</span>
        <div className="flex justify-between items-center w-full">
          <div>
            <Dropdown value={currentSort} onChange={(e) => setCurrentSort(e.value)} options={sortItems} optionLabel="name" optionValue="code" />
          </div>

          <Button label="Добавить новость" onClick={() => setDialogOpen(true)} />
        </div>

        <VirtualScroller
            items={allRows}
            itemSize={300}
            itemTemplate={(item: NewsItemType) => <NewsItem item={item} onClick={selectNews} />}
            lazy
            onLazyLoad={onLazyLoad}
            style={{ width: '1000px', height: '500px' }}
        />

        <NewsDialog isOpen={isDialogOpen} news={selectedNews} handleCloseDialog={handleCloseDialog} />
      </>
  )
}