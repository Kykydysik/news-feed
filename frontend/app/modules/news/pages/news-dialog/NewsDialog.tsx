import { Dialog } from "primereact/dialog";
import type { NewsItem } from "~/modules/news/types";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { useNewsDialog } from "~/modules/news/pages/news-dialog/use-news-dialog";

export default function NewsDialog({
  news,
  handleCloseDialog,
  isOpen,
}: {
  news: NewsItem | null;
  handleCloseDialog: () => void;
  isOpen: boolean;
}) {
  const { handleNewsItem, handleSubmit, onSubmit, setSelectedFile, register } =
    useNewsDialog({ news, handleCloseDialog, isOpen });

  if (!isOpen) return null;

  return (
    <Dialog
      header={news?.title ?? "Добавление новости"}
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={handleCloseDialog}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FileUpload
          name="image"
          accept="image/*"
          customUpload
          onSelect={(e) => setSelectedFile(e.files[0])}
          className="w-full"
        />

        <InputText placeholder="Заголовок новости" {...register("title")} />

        <InputTextarea
          placeholder="Текст новости"
          {...register("news_text")}
          rows={5}
          cols={30}
        />

        <div className="flex gap-4">
          {news && (
            <Button
              label="Удалить"
              severity="danger"
              onClick={handleNewsItem}
            />
          )}

          <Button label="Сохранить" type="submit" />
        </div>
      </form>
    </Dialog>
  );
}
