import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="">
      {/* <h1>Mother Project Auth Layout</h1> */}

      <div className="lg:max-w-7xl flex mx-auto lg:min-h-[calc(100vh-50px)] items-center justify-center lg:p-0 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
