import { LucideEdit, LucideLoader, LucideXCircle } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../lib/axios.js";
import Swal from "sweetalert2";

type User = {
  _id: string | number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
};

type UserModalProps = {
  isOpen: boolean;
  selectedUser?: Partial<User> | null;
  onClose: () => void;
  onSubmit: () => void;
  user?: Partial<User> | null;
};

const getInitialFormData = (user?: Partial<User> | null) => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  avatar: user?.avatar ?? "",
  bio: user?.bio ?? "",
});

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  selectedUser,
}: UserModalProps) => {
  const [formData, setFormData] = useState(() => getInitialFormData(user));
  const [message, setMessage] = useState("");
  const userName = user?.name ?? selectedUser?.name ?? "User";

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const targetUser = user ?? selectedUser;
    if (!targetUser?._id) return;
    const payload = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      bio: formData.bio,
    };

    try {
      const response = await axiosInstance.patch(
        `/users/${targetUser._id}`,
        payload,
      );
      if (response.data?.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User has been updated!",
          showConfirmButton: false,
          timer: 1500,
        });
        setMessage("User updated successfully!");
        onSubmit();
      }
    } catch (error) {
      console.error("Error in updating user", error);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`} open={isOpen}>
      <div className="modal-box">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="">
          <form
            key={user?._id ?? "new-user"}
            onSubmit={handleSubmit}
            className="w-full space-y-4"
          >
            <div className="flex justify-center">
              <div className="">
                <img
                  src={formData.avatar}
                  alt=""
                  className="w-32 h-32 rounded-full shadow-sm"
                />

                <p className="font-bold text-sm flex justify-center">
                  {user ? `Hello, ${userName}!` : "Hello!"}
                </p>
              </div>
            </div>
            {message && (
              <p className="text-blue-500 bg-blue-100 font-bold p-2 border border-blue-300 rounded-sm shadow flex items-center gap-1">
                <LucideLoader className="animate-spin" size={16} /> {message}
              </p>
            )}
            <input
              type="text"
              name="name"
              className="input input-sm w-full"
              value={formData.name}
              onChange={handleFieldChange}
            />
            <input
              type="email"
              name="email"
              className="input input-sm w-full"
              value={formData.email}
              onChange={handleFieldChange}
            />
            <input
              type="url"
              name="avatar"
              className="input input-sm w-full"
              value={formData.avatar}
              onChange={handleFieldChange}
            />
            <textarea
              name="bio"
              id=""
              className="w-full textarea"
              value={formData.bio}
              onChange={handleFieldChange}
            ></textarea>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="btn btn-sm btn-primary flex items-center gap-1"
              >
                <LucideEdit size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-warning flex items-center gap-1"
              >
                <LucideXCircle size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default UserModal;
