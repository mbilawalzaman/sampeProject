import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/getUsers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Ensure cookies are sent with the request
          },
        );
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

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter users based on the searchId
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
          onChange={(e) => setSearchId(e.target.value)} // Update searchId on input change
          placeholder="Enter user ID"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2 border border-gray-300">ID</th>
            <th className="px-4 py-2 border border-gray-300">Name</th>
            <th className="px-4 py-2 border border-gray-300">Email</th>
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
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="text-center px-4 py-2 border border-gray-300">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
