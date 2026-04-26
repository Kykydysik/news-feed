import NotUserAuth from "~/modules/profile/ui/profile-widget/not-auth-user/NotUserAuth";
import AuthUserWidget from "~/modules/profile/ui/profile-widget/auth-user/AuthUserWidget";
import { useLoadMe } from "~/modules/profile/service";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setProfile } from "~/modules/profile/store";
import type { RootState } from "~/store/store";
import { socketService } from "~/shared/api/socket-server";

export default function ProfileWidget() {
  const { data, isPending } = useLoadMe();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    if (data) {
      dispatch(setProfile(data));
      socketService.connect();
    }
  }, [data]);

  if (isPending) return <>Loading...</>;

  if (profile) {
    return <AuthUserWidget />;
  } else {
    return (
      <div className="flex justify-end">
        <NotUserAuth />
      </div>
    );
  }
}
