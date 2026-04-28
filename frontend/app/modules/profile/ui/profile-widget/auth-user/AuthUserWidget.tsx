import EditProfile from "~/modules/profile/ui/profile-widget/auth-user/edit-profile/EditProfile";
import { useSelector } from "react-redux";
import type { RootState } from "~/store/store";
import type { Profile } from "~/modules/profile/types";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { reportServices, ReportType } from "~/modules/reports"
import { socketService } from "~/shared/api/socket-server";
import { useEffect, useRef } from "react";
import { Toast } from 'primereact/toast'

export default function AuthUserWidget() {
  const profile = useSelector(
    (state: RootState) => state.profile.profile,
  ) as Profile;
  const { mutateAsync } = reportServices.useCreateReport()

  const toast = useRef(null);

  //TODO вынести useEffect в отдельные компоненты что бы по красоте было

  useEffect(() => {
    const unsubscribe = socketService.on(
      "start-create-report",
      () => {
        toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Новости формируются в отчет' });
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = socketService.on(
      "create-report-success",
      (data) => {
        window.open(data[0].link);
        toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Началось скачивание отчета' });
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-end gap-4">
      <Button label="Скачать новости" onClick={() => mutateAsync(ReportType.News)} />

      <Avatar
        image={
          profile.avatar ??
          "http://localhost:3000/uploads/360_F_77606013_X188cE6Zdy13xJJeMVOd2JqYhyiNoJNC.jpg"
        }
        size="xlarge"
        shape="circle"
      />

      <div className="text-center">{profile.email}</div>

      <EditProfile />

      <Toast ref={toast} />
    </div>
  );
}
