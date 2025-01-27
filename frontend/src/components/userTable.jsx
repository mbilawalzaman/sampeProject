import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const navigate = useNavigate();

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        localStorage.clear();
        alert("Session expired. Please log in again.");
        navigate("/");
        return;
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  // Function to handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: updatedName,
      email: updatedEmail,
      password: updatedPassword,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/updateUser/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      // Close modal and refresh user list
      await fetchUsers(); // Refetch the updated user list
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
    setUpdatedPassword("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredUsers = users.filter((user) =>
    user.id.toString().includes(searchId),
  );

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="searchId" className="mr-2">
          Search by ID:
        </label>
        <input
          type="text"
          id="searchId"
          className="border border-gray-300 rounded px-3 py-1"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter user ID"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2 border border-gray-300">ID</th>
            <th className="px-4 py-2 border border-gray-300">Name</th>
            <th className="px-4 py-2 border border-gray-300">Email</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="bg-white hover:bg-gray-100 text-center text-black">
                <td className="px-4 py-2 border border-gray-300">{user.id}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {user.name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {user.email}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center px-4 py-2 border border-gray-300">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">
                  Password (Leave empty to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
