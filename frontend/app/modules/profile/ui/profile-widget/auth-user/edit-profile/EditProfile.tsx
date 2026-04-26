import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import type { RootState } from "~/store/store";
import type { Profile } from "~/modules/profile/types";
import {
  ProfileQueryKeys,
  useUpdateMeRequest,
} from "~/modules/profile/service";
import { useQueryClient } from "@tanstack/react-query";

interface EditProfileForm {
  email: string;
  first_name: string;
  last_name: string;
  information: string;
}

export default function EditProfile() {
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const profile = useSelector(
    (state: RootState) => state.profile.profile,
  ) as Profile;
  const queryClient = useQueryClient();

  const schema = yup.object({
    email: yup.string().email().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    information: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      information: profile.information,
    },
  });

  const { mutateAsync } = useUpdateMeRequest();
  const onSubmit = async (data: EditProfileForm) => {
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("information", data.information);

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    await mutateAsync(formData);
    await queryClient.invalidateQueries({ queryKey: [ProfileQueryKeys.Me] });

    setVisible(false);
  };

  return (
    <div>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Редактирование профиля"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FileUpload
            name="image"
            accept="image/*"
            customUpload
            onSelect={(e) => setSelectedFile(e.files[0])}
            className="w-full"
          />

          <InputText placeholder="Email" {...register("email")} />
          <InputText placeholder="first_name" {...register("first_name")} />
          <InputText placeholder="last_name" {...register("last_name")} />
          <InputText placeholder="information" {...register("information")} />

          <Button label="Сохранить" type="submit" />
        </form>
      </Dialog>
    </div>
  );
}
