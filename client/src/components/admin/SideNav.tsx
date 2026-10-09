import { LucideSettings, LucideUser } from "lucide-react";

const SideNav = () => {
  const size = 18; // Set the desired size for the icons
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LucideSettings size={size} />,
    },
    {
      name: "Users",
      path: "/admin/dashboard/users",
      icon: <LucideUser size={size} />,
    },
    {
      name: "Settings",
      path: "/admin/dashboard/settings",
      icon: <LucideSettings size={size} />,
    },
  ];
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.path}
              className="text-blue-500 hover:underline flex items-center gap-2"
            >
              {item.icon} {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
