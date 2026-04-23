import { httpClient } from '~/shared/api/http';
import type { NewsItem } from "~/modules/news/types";

export const loadNewsApi = (pageParam: number, sort: 'ASC' | 'DESC') =>
  httpClient.get<{ items: NewsItem[], totalCount: 0 }>('/news', { offset: pageParam, sort });

export const removeNewsApi = (id: NewsItem['id']) =>
    httpClient.delete(`/news/${id}`);

export const updateNewsApi = (data: { id: NewsItem['id'], formData: FormData }) =>
    httpClient.patch(`/news/${data.id}`, data.formData);

export const createNewsApi = (data: FormData) =>
    httpClient.post(`/news`, data);