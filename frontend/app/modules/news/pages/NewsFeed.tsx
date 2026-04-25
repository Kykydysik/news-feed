import { useState } from "react";
import { VirtualScroller } from 'primereact/virtualscroller';
import NewsItem from "~/modules/news/pages/news-item/NewsItem";
import type { NewsItem as NewsItemType } from "~/modules/news/types";
import NewsDialog from "~/modules/news/pages/news-dialog/NewsDialog";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import {useSelector} from "react-redux";
import type {RootState} from "~/store/store";
import { useLoadNews } from './use-load-news'

export default function NewsFeed() {
  const { onLazyLoad, data, currentSort, setCurrentSort, sortItems, allRows } = useLoadNews()
  const profile = useSelector((state: RootState) => state.profile.profile)

  const [ selectedNews, setSelectedNews ] = useState<NewsItemType | null>(null)
  const [ isDialogOpen, setDialogOpen ] = useState<boolean>(false)

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
      <div className="flex flex-col gap-4 h-full p-4">
        <span className="font-bold block mb-2 text-center text-2xl">Список новостей</span>

        <div className="flex justify-between items-center w-full shrink-0">
          <div>
            <Dropdown
                value={currentSort}
                onChange={(e) => setCurrentSort(e.value)}
                options={sortItems}
                optionLabel="name"
                optionValue="code"
                className="w-full md:w-auto"
            />
          </div>

          {profile && <Button label="Добавить новость" onClick={() => setDialogOpen(true)} />}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <VirtualScroller
              items={allRows}
              itemSize={300}
              itemTemplate={(item: NewsItemType) => <NewsItem item={item} onClick={selectNews} />}
              lazy
              onLazyLoad={onLazyLoad}
              style={{ width: '100%', height: '100%' }}
          />
        </div>

        <NewsDialog isOpen={isDialogOpen} news={selectedNews} handleCloseDialog={handleCloseDialog} />
      </div>
  )
}