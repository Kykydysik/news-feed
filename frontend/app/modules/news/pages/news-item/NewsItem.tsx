import type { NewsItem } from "~/modules/news/types";
import { Card } from "primereact/card";

export default function NewsItem({
  item,
  onClick,
}: {
  item: NewsItem;
  onClick: (item: NewsItem) => void;
}) {
  const setNews = () => {
    onClick(item);
  };

  return (
    <Card onClick={setNews} className="relative cursor-pointer">
      <div className="flex gap-4 pr-3">
        <div className="flex-shrink-0 w-[120px] h-full">
          <img alt="Card" src={item.image} />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-1">
          <div className="text-2xl font-bold">{item.title}</div>

          <p>{item.news_text}</p>

          <div>{String(item.created_at)}</div>
        </div>
      </div>
    </Card>
  );
}
