import {useMutation, useQuery} from '@tanstack/react-query';
import {authApi, loadMeApi, updateMeApi} from "~/modules/profile/api";
import type {AuthRequestParams} from "~/modules/profile/types";

export enum ProfileQueryKeys {
  Me = 'me',
}

export const useLoadMe = () =>
    useQuery({
      queryKey: [ProfileQueryKeys.Me],
      queryFn: loadMeApi,
      retry: false,
    })

export const useAuthRequest = () =>
    useMutation({
      mutationFn: (data: AuthRequestParams) =>
          authApi(data),
    });

export const useUpdateMeRequest = () =>
    useMutation({
      mutationFn: (data: FormData) =>
          updateMeApi(data),
    });