import { Outlet } from 'react-router';
import ProfileWidget from "~/modules/profile/ui/profile-widget/ProfileWidget";
import { Toolbar } from 'primereact/toolbar';

export default function CenterContent() {
  return (
      <div className="flex flex-col gap-4">
        <div className="card">
          <Toolbar end={ProfileWidget} />
        </div>

        <div className="h-screen w-screen flex flex-col items-center">
          <div className="w-[1000px]">
            <Outlet />
          </div>
        </div>
      </div>
  );
}
