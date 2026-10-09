import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <div>
      <NavBar />

      <div className="lg:max-w-7xl flex mx-auto lg:min-h-[calc(100vh-100px)] items-centers justify-center lg:py-8 py-4 lg:p-0 p-4 ">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
