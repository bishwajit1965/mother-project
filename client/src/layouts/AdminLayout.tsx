import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminFooter from "../components/admin/AdminFooter";
import SideNav from "../components/admin/SideNav";

const AdminLayout = () => {
  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 gap-4 items-center justify-between bg-white">
      <aside className="lg:col-span-2 col-span-12 min-h-[calc(100vh-0px)] shadow-2xl sticky top-0">
        <div className="bg-gray-200 p-4 rounded-sm shadow-md border-b border-gray-300">
          <h1 className="text-xl font-bold">Left Sidebar</h1>
        </div>
        <div className="p-4">
          <SideNav />
        </div>
      </aside>

      <main className="lg:col-span-10 col-span-12 min-h-[calc(100vh-120px)] shadow-2xl">
        <AdminNavbar />

        <div className="min-h-[calc(100vh-120px)] p-4">
          <Outlet />
        </div>

        <AdminFooter />
      </main>
    </div>
  );
};

export default AdminLayout;
