import EditProfile from "~/modules/profile/ui/profile-widget/auth-user/edit-profile/EditProfile";
import { useSelector } from 'react-redux'
import type { RootState } from "~/store/store";
import type { Profile } from "~/modules/profile/types";
import { Avatar } from 'primereact/avatar';

export default function AuthUserWidget() {
  const profile = useSelector((state: RootState) => state.profile.profile) as Profile;

  return (
      <div className="flex items-center justify-end gap-4">
        <Avatar image={profile.avatar ?? 'http://localhost:3000/uploads/360_F_77606013_X188cE6Zdy13xJJeMVOd2JqYhyiNoJNC.jpg'} size="xlarge" shape="circle" />

        <div className="text-center">{profile.email}</div>

        <EditProfile />
      </div>
  )
}