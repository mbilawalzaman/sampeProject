import React, { useEffect, useState } from "react";
import { FiEye, FiCheck, FiX, FiTrash } from "react-icons/fi";

const ApplicationTable = ({ userRole }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs/getAllJobApplications", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch applications");
        const data = await response.json();
        setApplications(data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${appId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setApplications(applications.filter((app) => app.id !== appId));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Job Title</th>
            <th className="py-2">Comapny</th>
            <th className="py-2">Applicant Name</th>
            <th className="py-2">Applicant Email</th>
            <th className="py-2">Cover Letter</th>
            <th className="py-2">CV</th>
            <th className="py-2">Status</th>
            <th className="py-2">Applied Date</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b hover:bg-gray-50">
              <td className="py-3">{app.Job?.title || "Unknown"}</td>
              <td>{app.Job?.employer?.name || "Unknown"}</td>
              <td>{app.User?.name || "Unknown"}</td>
              <td>{app.User?.email || "Unknown"}</td>
              <td>{app.coverLetter}</td>
              <td>
                {app.cv ? (
                  <a
                    href={`http://localhost:5000/uploads/cvs/${app.cv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View CV
                  </a>
                ) : (
                  <span className="text-gray-500">No CV uploaded</span>
                )}
              </td>
              <td>{app.status}</td>
              <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
              <td className="flex justify-end space-x-3">
                <button className="text-blue-600 hover:underline">
                  <FiEye />
                </button>
                {userRole === "admin" && (
                  <>
                    <button className="text-green-600 hover:underline">
                      <FiCheck />
                    </button>
                    <button className="text-red-600 hover:underline">
                      <FiX />
                    </button>
                  </>
                )}
                {userRole === "admin" && (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(app.id)}
                  >
                    <FiTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
