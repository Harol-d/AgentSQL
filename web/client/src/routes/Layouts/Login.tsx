import { Outlet } from 'react-router-dom';

export default function LoginLayout() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
