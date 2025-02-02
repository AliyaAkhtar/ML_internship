"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function CreateJobPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [keywords, setKeywords] = useState("");
  const [jdFile, setJdFile] = useState(null); // State for storing the file
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  
  const isActive = (path) =>
    pathname === path ? "text-blue-900 font-bold" : "";

  const [username, setUsername] = useState("");
  
  useEffect(() => {
      // Retrieve user details from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const { username } = JSON.parse(storedUser);
        setUsername(username);
      }
    }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setJdFile(file);
      console.log("Selected file:", file.name);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    setLoading(true);
  
    if (!jdFile) {
      alert("Please upload a job description file.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("HrId", 1); // Replace with actual HR ID if needed
    formData.append("Title", jobTitle);
    formData.append("Description", jobDescription);
    formData.append("Location", location);
    formData.append("Salary", salary);
    formData.append("Requirements", requirements);
    formData.append("JdPdf", jdFile); // Updated key to match DTO

    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    try {
      const response = await fetch("https://localhost:7130/api/jobs", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        alert("Job created successfully!");
        router.push("/hr");
      } else {
        const error = await response.json();
        console.error("Backend error:", error);
        alert(`Failed to create job: ${error.detail || "Unexpected error"}`);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An error occurred while creating the job. Please try again.");
    }finally {
      setLoading(false);  // Set loading state back to false after submission finishes
    }
  };
  
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
      <div className="flex-1 p-8 w-4/5">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <button
            onClick={() => router.push("/hr")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Listings
          </button>
        </header>

        {/* Form Section */}
        <form
          onSubmit={handleCreateJob}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter job title"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Enter job description"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="uploadJD"
              className="block font-medium text-gray-700"
            >
              Upload Job Description (JD)
            </label>
            <input
              id="uploadJD"
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              onChange={handleFileUpload}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter job location"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Salary</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter salary"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Requirements
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Enter job requirements"
            ></textarea>
          </div>

          

          {/* <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Post Job
          </button> */}

          <div className="flex justify-center items-center">
  {loading && (
    <div className="mr-4">
      {/* Spinner */}
      <svg
        className="animate-spin h-6 w-6 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0116 0v4H4v-4z"
        ></path>
      </svg>
    </div>
  )}
  <button
    type="submit"
    className={`w-48 p-3 bg-blue-600 text-white font-bold rounded-lg ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
    }`}
    disabled={loading}
  >
    {loading ? "Posting..." : "Post Job"}
  </button>
</div>

        </form>
      </div>
    </div>
  );
}
