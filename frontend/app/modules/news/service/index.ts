import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  createNewsApi,
  loadNewsApi,
  removeNewsApi,
  updateNewsApi,
} from "~/modules/news/api";
import type { CreateNewsItemParams, NewsItem } from "~/modules/news/types";

export enum NewsQueryKeys {
  LoadNewsList = "LoadNewsList",
}

export const useLoadNews = (sort: "ASC" | "DESC") => {
  return useInfiniteQuery<{ items: NewsItem[]; totalCount: 0 }>({
    queryKey: [NewsQueryKeys.LoadNewsList, sort],
    queryFn: async ({ pageParam }) => {
      console.log(sort);
      return loadNewsApi(pageParam as number, sort);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const totalLoaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      const totalCount = lastPage.totalCount || 0;

      return totalLoaded <= totalCount ? totalLoaded : undefined;
    },
  });
};

export const useRemoveNews = () =>
  useMutation({
    mutationFn: (id: NewsItem["id"]) => removeNewsApi(id),
  });

export const useUpdateNews = () =>
  useMutation({
    mutationFn: (data: { id: NewsItem["id"]; formData: FormData }) =>
      updateNewsApi(data),
  });

export const useCreateNews = () =>
  useMutation({
    mutationFn: (data: FormData) => createNewsApi(data),
  });
