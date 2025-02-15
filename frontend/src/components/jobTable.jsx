import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const JobTable = ({ userRole, userId }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs/getAllJobs", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data.jobs); // Ensure we're accessing the "jobs" array from the response
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEdit = () => {

    alert("button clicked!")
  }

  return (
    <div className="bg-white p-4 shadow-md rounded-lg overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Location</th>
            <th className="p-3 border">Salary Range</th>
            <th className="p-3 border">Employment Type</th>
            <th className="p-3 border">Requirements</th>
            <th className="p-3 border text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job.id} className="border-b hover:bg-gray-50">
                <td className="p-3 border">{job.title}</td>
                <td className="p-3 border">{job.description}</td>
                <td className="p-3 border">{job.location}</td>
                <td className="p-3 border">{job.salaryRange}</td>
                <td className="p-3 border">{job.employmentType}</td>
                <td className="p-3 border">{job.requirements}</td>
                <td className="p-3 border flex justify-end space-x-3">
                  {(userRole === "admin" || job.employerId === userId) && (
                    <button className="text-blue-600 hover:underline" onClick={handleEdit}>
                      <FiEdit />
                    </button>
                  )}
                  {(userRole === "admin" || job.employerId === userId)&& (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(job.id)}
                    >
                      <FiTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
