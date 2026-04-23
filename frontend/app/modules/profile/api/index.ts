import {httpClient} from "~/shared/api/http";
import type {AuthRequestParams, Profile} from "~/modules/profile/types";

export const loadMeApi = () =>
    httpClient.get<Profile>('/user/me');

export const updateMeApi = (data: FormData) =>
    httpClient.patch('/user/me', data);

export const authApi = (data: AuthRequestParams) =>
    httpClient.post<{ access_token: string }>('/auth/login', data);