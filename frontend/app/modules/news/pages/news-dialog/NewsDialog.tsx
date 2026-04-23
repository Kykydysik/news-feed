import { Dialog } from 'primereact/dialog';
import type {CreateNewsItemParams, NewsItem} from "~/modules/news/types";
import * as yup from "yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useCreateNews, useRemoveNews, useUpdateNews } from "~/modules/news/service";
import { FileUpload } from 'primereact/fileupload'
import { useState } from "react";

export default function NewsDialog({ news, handleCloseDialog, isOpen }: { news: NewsItem | null; handleCloseDialog: () => void; isOpen: boolean }) {

  if (!isOpen) return null

  const { mutateAsync } = useRemoveNews()
  const { mutateAsync: updateNews } = useUpdateNews()
  const { mutateAsync: createNews } = useCreateNews()
  const schema = yup.object({
    title: yup
        .string()
        .required(),
    news_text: yup
        .string()
        .required(),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: news?.title || '',
      news_text: news?.news_text || '',
    },
  });

  const onSubmit: SubmitHandler<CreateNewsItemParams> = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('news_text', data.news_text);

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (news) {
      await updateNews({ id: news.id, formData });
    } else {
      await createNews(formData);
    }

    handleCloseDialog()
  }

  const handleNewsItem = async () => {
    if (!news) return

    await mutateAsync(news.id)
    handleCloseDialog()
  }

  return (
      <Dialog header={news?.title ?? 'Добавление новости'} visible={isOpen} style={{ width: '50vw' }} onHide={handleCloseDialog}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <FileUpload
              name="image"
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              onSelect={(e) => setSelectedFile(e.files[0])}
              className="w-full"
          />

          <InputText placeholder="Заголовок новости" {...register("title")} />

          <InputTextarea placeholder="Текст новости" {...register("news_text")} rows={5} cols={30} />

          <div className="flex gap-4">
            {news && <Button
                label='Удалить'
                severity="danger"
                onClick={handleNewsItem}
            />}

            <Button label='Сохранить' type='submit' />
          </div>
        </form>
      </Dialog>
  )
}