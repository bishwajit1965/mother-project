import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios.js";
import { LucideEdit, LucideTrash } from "lucide-react";
import UserModal from "./UserModal.js";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/users");
        setUsers(response.data.data);
        console.log("Users data:", response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleModal = (userId?: string | number) => {
    const user = userId ? chosenUser(userId) : null;
    setSelectedUser(user);
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const chosenUser = (userId?: string | number): User | null => {
    if (!userId) return null;
    return users.find((user) => user._id === userId) ?? null;
  };

  const handleDelete = async (userId: string | number) => {
    const confirmed = window.confirm("Delete this user?");

    if (!confirmed) return;
    try {
      const response = await axiosInstance.patch(
        `/users/${userId}/soft-delete`,
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error in deleting user", error);
    }
  };

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
                      <div className="mask mask-squircle h-12 w-12 cursor-pointer">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          onClick={() => handleToggleModal(user._id)}
                        />
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
                  <button
                    className="btn btn-sm btn-primary"
                    title="Edit"
                    onClick={() => handleToggleModal(user._id)}
                  >
                    <LucideEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-sm btn-secondary"
                    title="Delete"
                  >
                    <LucideTrash size={18} />
                  </button>
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

        {/* CRUD MODAL TO UPDATE */}
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            user={selectedUser}
            onSubmit={() => {
              const fetchUsers = async () => {
                try {
                  const response = await axiosInstance.get("/auth/users");
                  setUsers(response.data.data);
                } catch (error) {
                  console.error("Error fetching users:", error);
                }
              };
              setTimeout(() => {
                setIsModalOpen(false);
                fetchUsers();
              }, 4500);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
