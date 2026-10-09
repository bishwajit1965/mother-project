import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios.js";
import { LucideEdit, LucideTrash } from "lucide-react";

type User = {
  _id: string | number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/users");
        if (response.data) {
          setUsers(response.data);
        }
        console.log("Users data:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Users List {users ? users.length : "N/A"}
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Registered on</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.bio}</td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="flex items-center gap-1">
                  <button className="btn btn-sm btn-primary" title="Edit">
                    <LucideEdit size={18} />
                  </button>
                  <button className="btn btn-sm btn-secondary" title="Delete">
                    <LucideTrash size={18} />
                  </button>
                  <div className="">{user._id}</div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Registered on</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <ul></ul>
    </div>
  );
};

export default UsersPage;
