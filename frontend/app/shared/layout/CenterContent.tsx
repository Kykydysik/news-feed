import { Outlet } from 'react-router';
import ProfileWidget from "~/modules/profile/ui/profile-widget/ProfileWidget";

export default function CenterContent() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-[1000px]">
        <ProfileWidget />

        <Outlet />
      </div>
    </div>
  );
}
