
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";

export default function JobDetailsPage({ params: promiseParams }) {
  const [params, setParams] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [jobApplications, setJobApplications] = useState([]);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);

  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [showApplications, setShowApplications] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      const { email } = JSON.parse(storedUser);
      setUsername(username);
      setEmail(email);
    }
  }, []);

  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "text-blue-900 font-bold" : "";

  useEffect(() => {
    async function unwrapParams() {
      try {
        const resolvedParams = await promiseParams;
        setParams(resolvedParams);
      } catch (error) {
        console.error("Error unwrapping parameters:", error);
      }
    }

    unwrapParams();
  }, [promiseParams]);

  useEffect(() => {
    if (params) {
      async function fetchJobDetails() {
        try {
          const response = await fetch(
            `https://localhost:7130/api/jobs/${params.jobId}`
          );
          const data = await response.json();
          setJobDetails(data);
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      }

      fetchJobDetails();
    }
  }, [params]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `https://localhost:7130/api/application/job/${params.jobId}`
      );
      const data = await response.json();

      const sortedApplications = data.sort(
        (a, b) => b.ResumeScore - a.ResumeScore
      );
      setJobApplications(sortedApplications);
      setShowApplications(true);
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  const fetchApplicationDetails = async (applicationId) => {
    try {
      const response = await fetch(
        `https://localhost:7130/api/application/${applicationId}`
      );
      const data = await response.json();
      setApplicationDetails(data);
    } catch (error) {
      console.error("Error fetching application details:", error);
    }
  };

  if (!params || !jobDetails) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  const toggleView = () => {
    setViewMode(viewMode === "cards" ? "table" : "cards");
  };

  const sendEmail = async (jobId, jobTitle, hrEmail, jobDescription, hrName, title) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://localhost:7130/api/email/send-email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId, // Case matches backend's expectation (lowercase 'j')
          jobTitle, // Match case from the .NET model
          hrEmail, // Match case from the .NET model
          jobDescription, // Include the necessary field
          hrName,
          title
        }),
      });
  
      if (response.ok) {
        console.log("Email sent successfully!");
        toast.success("Email sent successfully!");
      } else {
        const errorData = await response.json(); // Parse error response
        console.error("Failed to send email:", errorData.message || response.statusText);
        toast.error(`Failed to send email: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while sending the email.");
    }finally {
      setLoading(false); // End loading
    }
  };
  
  

  return (
    <div className="flex h-screen font-sans">
      {/* Toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Overlay when loading */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
          {/* Replace with a spinner */}
          <p className="text-white text-lg mt-4">Sending email...</p>
        </div>
      )}

      <aside className="w-1/5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-700 text-white p-6 flex flex-col shadow-lg">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {username[0]}
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold">{username || "HR"}</h2>
            <p className="text-sm text-gray-300">HR Manager</p>
          </div>
        </div>
        <nav>
          <ul className="space-y-4 text-center md:text-left">
            <li
              className={`hover:text-gray-300 cursor-pointer transition-colors duration-300 ${isActive(
                "/hr"
              )}`}
              onClick={() => router.push("/hr")}
            >
              Dashboard
            </li>
            <li
              className={`hover:text-gray-300 cursor-pointer transition-colors duration-300 ${isActive(
                "/hr/settings"
              )}`}
              onClick={() => router.push("/hr/settings")}
            >
              Settings
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer transition-colors duration-300"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      <div className="w-4/5 p-8 bg-gray-100 min-h-screen overflow-y-auto">
        <div className="bg-white p-6 shadow-md rounded-md hover:shadow-xl hover:bg-gray-100 transition-transform duration-300 transform">
          <h1 className="text-3xl font-bold mb-4">{jobDetails.title}</h1>
          <p className="mb-4">{jobDetails.description}</p>
          <p className="mb-2">
            <strong>Location:</strong> {jobDetails.location}
          </p>
          <p className="mb-2">
            <strong>Salary:</strong> {jobDetails.salary}
          </p>
          <p className="mb-2">
            <strong>Requirements:</strong> {jobDetails.requirements}
          </p>
          {jobDetails.jdPdf && (
            <a
              href={jobDetails.jdPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mt-4"
            >
              View Job Description (PDF)
            </a>
          )}
          <button
            onClick={fetchApplications}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View Applicants
          </button>
        </div>

        {showApplications && jobApplications.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              {/* Title aligned to the left */}
              <h2 className="text-2xl font-bold">Applications</h2>

              {/* Buttons aligned to the right */}
              <div className="flex space-x-4">
                <button
                  onClick={toggleView}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <span>{viewMode === "cards" ? "Table" : "Cards"}</span>
                  <FontAwesomeIcon
                    icon={viewMode === "cards" ? faTable : faCreditCard}
                    className="ml-2"
                  />
                </button>
                <button
                  onClick={() =>
                    sendEmail(params.jobId, jobDetails.title, email, jobDetails.description, username, "HR Manager")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Send Email to Applicants
                </button>
              </div>
            </div>

            {viewMode === "cards" ? (
              <div className="grid grid-cols-3 gap-6">
                {jobApplications.map((application, index) => (
                  <div
                    key={application.applicationId || `application-${index}`}
                    className="border p-4 rounded-lg bg-gray-50"
                    onClick={() =>
                      fetchApplicationDetails(application.applicationId)
                    }
                  >
                    <p>
                      <strong>Name:</strong> {application.candidateName}
                    </p>
                    <p>
                      <strong>Email:</strong> {application.candidateEmail}
                    </p>
                    <p>
                      <strong>Resume Score:</strong> {application.resumeScore}
                    </p>
                    <p>
                      <strong>Applied On:</strong>{" "}
                      {new Date(application.appliedOn).toLocaleDateString()}
                    </p>
                    <a
                      href={application.resumeFilePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Resume Score</th>
                    <th className="border p-2">Applied On</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.map((application, index) => (
                    <tr key={application.applicationId || `application-${index}`}>
                      <td className="border p-2">{application.candidateName}</td>
                      <td className="border p-2">{application.candidateEmail}</td>
                      <td className="border p-2">{application.resumeScore}</td>
                      <td className="border p-2">
                        {new Date(application.appliedOn).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={() =>
                            fetchApplicationDetails(application.applicationId)
                          }
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                          Details
                        </button>
                        <a
                          href={application.resumeFilePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 underline pl-5"
                        >
                          View Resume
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {applicationDetails && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">Application Details</h2>
            <p>
              <strong>Candidate Name:</strong>{" "}
              {applicationDetails.candidateName}
            </p>
            <p>
              <strong>Candidate Email:</strong>{" "}
              {applicationDetails.candidateEmail}
            </p>
            <p>
              <strong>Candidate Phone:</strong>{" "}
              {applicationDetails.candidatePhone}
            </p>
            <p>
              <strong>Cover Letter:</strong>{" "}
              {applicationDetails.coverLetter || "No cover letter provided."}
            </p>
            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={applicationDetails.resumeFilePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
