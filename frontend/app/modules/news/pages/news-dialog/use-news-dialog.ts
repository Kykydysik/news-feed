import {
  NewsQueryKeys,
  useCreateNews,
  useRemoveNews,
  useUpdateNews,
} from "~/modules/news/service";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateNewsItemParams, NewsItem } from "~/modules/news/types";
import { useQueryClient } from "@tanstack/react-query";

export const useNewsDialog = ({
  news,
  handleCloseDialog,
  isOpen,
}: {
  news: NewsItem | null;
  handleCloseDialog: () => void;
  isOpen: boolean;
}) => {
  const { mutateAsync } = useRemoveNews();
  const { mutateAsync: updateNews } = useUpdateNews();
  const { mutateAsync: createNews } = useCreateNews();
  const schema = yup.object({
    title: yup.string().required(),
    news_text: yup.string().required(),
  });
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: news?.title || "",
      news_text: news?.news_text || "",
    },
  });

  useEffect(() => {
    reset({
      title: news?.title || "",
      news_text: news?.news_text || "",
    });
  }, [news, reset]);

  const onSubmit: SubmitHandler<CreateNewsItemParams> = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("news_text", data.news_text);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (news) {
      await updateNews({ id: news.id, formData });
      // тут тоже можно получать по сокетам, искать по id и обновлять, но потом переделаю
      // или пусть найдется добрый человек, который сделает это за меня
      await queryClient.invalidateQueries({ queryKey: [NewsQueryKeys.LoadNewsList] });
    } else {
      await createNews(formData);
    }

    handleCloseDialog();
  };

  const handleNewsItem = async () => {
    if (!news) return;

    await mutateAsync(news.id);
    reset();
    setSelectedFile(null);
    handleCloseDialog();
  };

  return {
    handleNewsItem,
    handleSubmit,
    onSubmit,
    setSelectedFile,
    register,
    isOpen,
  };
};
