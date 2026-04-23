import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useState } from "react";
import * as yup from "yup";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {ProfileQueryKeys, useAuthRequest} from "~/modules/profile/service";
import type { AuthRequestParams } from "~/modules/profile/types";
import { saveToken } from "~/modules/profile/lib/is-user-auth";
import {useQueryClient} from "@tanstack/react-query";

export default function NotUserAuth() {
  const queryClient = useQueryClient()
  const [visible, setVisible] = useState(false);
  const schema = yup.object({
    email: yup
        .string()
        .email()
        .required(),
    password: yup
        .string()
        .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'test@test.ru',
      password: '123',
    },
  });

  const { mutateAsync, isPending } = useAuthRequest()
  const onSubmit = async (data: AuthRequestParams) => {
    const { access_token } = await mutateAsync(data)
    saveToken(access_token)
    await queryClient.invalidateQueries({queryKey: [ProfileQueryKeys.Me]})
    setVisible(false)
  }

  return (
      <>
        <Button label="Войти" onClick={() => setVisible(true)} />

        <Dialog header="Авторизация" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

            <InputText placeholder="Email" {...register("email")} />

            <InputText placeholder="Password" {...register("password")} />

            <Button label='Войти' type='submit' />
          </form>
        </Dialog>
      </>
  )
}