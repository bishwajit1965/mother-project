const AdminFooter = () => {
  const date = new Date();
  return (
    <div className="bg-gray-200 p-4 text-center text-gray-800 sticky bottom-0">
      <p>&copy; {date.getFullYear()} Mother Project. All rights reserved.</p>
    </div>
  );
};

export default AdminFooter;
