import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const JobTable = ({ userRole, userId }) => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs/getAllJobs", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data.jobs);
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

  const handleApplyJob = async () => {
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (cvFile) formData.append("cv", cvFile);

      const response = await fetch(`http://localhost:5000/api/jobs/applyForJob?id=${selectedJobId}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to apply");

      alert("Application submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.message);
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/updateJob?id=${selectedJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(selectedJob),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update job");

      setJobs(jobs.map((job) => (job.id === selectedJob.id ? data.job : job)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating job:", error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 border">Company</th>
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
            jobs.map((job) => {
              console.log(job); // Correct placement inside {}
              return (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{job.employer ? job.employer.name : 'N/A'}</td>
                  <td className="p-3 border">{job.title}</td>
                  <td className="p-3 border">{job.description}</td>
                  <td className="p-3 border">{job.location}</td>
                  <td className="p-3 border">{job.salaryRange}</td>
                  <td className="p-3 border">{job.employmentType}</td>
                  <td className="p-3 border">{job.requirements}</td>
                  <td className="p-3 border">
                    {(userRole === "admin" || job.employerId === userId) && (
                      <button
                        className="text-blue-600 hover:underline mr-2"
                        onClick={() => handleEditJob(job)}
                      >
                        <FiEdit />
                      </button>
                    )}
                    {(userRole === "admin" || job.employerId === userId) && (
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(job.id)}
                      >
                        <FiTrash />
                      </button>
                    )}
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Job Application */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>
            <textarea
              className="w-full border p-2 mb-3"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter"
            />
            <input
              type="file"
              className="mb-3"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleApplyJob}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for update job details */}
      {isEditModalOpen && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Job</h2>
            <input
              type="text"
              className="w-full border p-2 mb-3"
              value={selectedJob.title}
              onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
              placeholder="Job Title"
            />
            <textarea
              className="w-full border p-2 mb-3"
              value={selectedJob.description}
              onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })}
              placeholder="Job Description"
            />
            <input
              type="text"
              className="w-full border p-2 mb-3"
              value={selectedJob.salaryRange}
              onChange={(e) => setSelectedJob({ ...selectedJob, salaryRange: e.target.value })}
              placeholder="Salary Range"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateJob}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTable;
