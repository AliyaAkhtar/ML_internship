"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function HRPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      setUsername(username);
    }
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "text-blue-900 font-bold" : "";

  const handleCreateJob = () => {
    router.push("/hr/create-job"); // Navigate to Create Job page
  };

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const { id } = JSON.parse(storedUser); // Get HR's id

        try {
          const response = await fetch(`https://localhost:7130/api/jobs/allHrJobs?hrId=${id}`);
          if (response.ok) {
            const data = await response.json();
            setJobs(data);
            console.log(data);
          } else {
            console.error("Failed to fetch jobs");
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    // Redirect to job details page with the clicked job's ID
    router.push(`/hr/jobDetail/${jobId}`);
  };

  if (loading) return <div>Loading...</div>;

  
  const handleLogout = () => {
    // Clear all stored data from localStorage
    localStorage.clear();
  
    // Redirect to the login page
    window.location.href = "/auth/login";
  };
  

  return (
    <div className="flex h-screen font-sans">
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

      {/* Main Content */}
      <main className="w-4/5 bg-gray-100 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Job Posts</h1>
          <button onClick={handleCreateJob} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create New Job
          </button>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 shadow-md rounded-md hover:shadow-xl hover:bg-gray-100 transition-shadow duration-300"
              // className="bg-white p-4 shadow rounded hover:bg-gray-50 cursor-pointer"
              // onClick={() => setSelectedJob(job)}
              // onClick={() => setJobs(jobs)}
              onClick={() => handleJobClick(job.id)}
            >
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
              <p className="text-gray-600 pt-3 line-clamp-3">{job.description}</p>
            </div>
          ))}
        </div>

        
      </main>
    </div>
  );
}
