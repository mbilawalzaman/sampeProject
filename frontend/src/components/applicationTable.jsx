import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const ApplicationTable = ({ userRole }) => {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(error.message);
      } finally {
        setLoading(false);
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

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/updateApplicationStatus?applicationId=${selectedApplication.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Update UI
      setApplications((prev) =>
        prev.map((app) => (app.id === selectedApplication.id ? { ...app, status: newStatus } : app))
      );

      alert("Application status updated!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Job Title</th>
            <th className="py-2">Company</th>
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
              <td className="flex justify-center mt-4 space-x-3">
                {userRole === "admin" || userRole === "employer" ? (
                  <button
                    className="text-yellow-600 hover:underline"
                    onClick={() => handleEditClick(app)}
                    aria-label="Edit Application"
                  >
                    <FiEdit />
                  </button>
                ) : null}
                {userRole === "admin" && (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(app.id)}
                    aria-label="Delete Application"
                  >
                    <FiTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Application Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update Application Status</h2>
            <select
              className="w-full border p-2 mb-3"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateStatus}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTable;
