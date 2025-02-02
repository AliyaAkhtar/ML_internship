"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function AppliedPage() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [username, setUsername] = useState("");
  const [candidateId, setCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "text-blue-900 font-bold" : "";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { id, username } = JSON.parse(storedUser);
      setUsername(username);
      setCandidateId(id);
    }
  }, []);

  useEffect(() => {
    
    if (candidateId) {
      const fetchAppliedJobs = async () => {
        try {
          const response = await fetch(
            `https://localhost:7130/api/application/candidate/${candidateId}`
          );
          if (response.ok) {
            const data = await response.json();
            setAppliedJobs(data);
          } else {
            console.error("Failed to fetch applied jobs");
          }
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
        }
        setLoading(false);
      };

      fetchAppliedJobs();
    }
  }, [candidateId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };  
  
  // async function handleQuizClick(jobTitle) {
  //   try {
  //     const response = await fetch(`https://localhost:7130/api/Quiz/${encodeURIComponent(jobTitle)}`);
  //     if (!response.ok) throw new Error(`Failed to fetch quiz: ${response.statusText}`);

  //     const data = await response.json();
  //     if (!data.questions) throw new Error("Quiz content not found in response");

  //     // Redirect to the quiz page with questions
  //     router.push(`/candidate/quiz/${encodeURIComponent(jobTitle)}?quizData=${encodeURIComponent(JSON.stringify(data.questions))}`);
  //   } catch (error) {
  //     console.error("Error fetching quiz:", error.message);
  //   }
  // }

  const handleQuizClick = (jobTitle) => {
    // Redirect to the quiz page with the job title as a query parameter
    router.push(`/candidate/quiz?jobTitle=${encodeURIComponent(jobTitle)}`);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="flex h-screen font-sans">
      <aside className="w-1/5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-700 text-white p-6 flex flex-col shadow-lg">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {username[0]}
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold">{username || "Candidate"}</h2>
            <p className="text-sm text-gray-300">Candidate</p>
          </div>
        </div>
        <nav>
          <ul className="space-y-4 text-center md:text-left">
            <li
              className={`hover:text-gray-300 cursor-pointer transition-colors duration-300 ${isActive(
                "/candidate"
              )}`}
              onClick={() => router.push("/candidate")}
            >
              Dashboard
            </li>
            <li
              className={`hover:text-gray-300 cursor-pointer transition-colors duration-300 ${isActive(
                "/candidate/applied-job"
              )}`}
              onClick={() => router.push("/candidate/applied-job")}
            >
              Applied Jobs
            </li>
            <li
              className={`hover:text-gray-300 cursor-pointer transition-colors duration-300 ${isActive(
                "/candidate/settings"
              )}`}
              onClick={() => router.push("/candidate/settings")}
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

      <main className="w-4/5 bg-gray-50 p-8 overflow-y-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Applied Jobs
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job) => (
                <div
                  key={job.applicationId}
                  className="p-6 bg-white shadow-md hover:shadow-lg rounded-lg transition-transform duration-300 transform hover:scale-105"
                >
                  <h2 className="text-xl font-semibold text-indigo-800">
                    {job.jobTitle}
                  </h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {job.jobDescription}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Applied On:{" "}
                    {new Date(job.appliedOn).toLocaleDateString()}
                  </p>
                  {/* Only show the Quiz button if isEmailSent is true */}
                  {job.isEmailSent && (
                    <button
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
                      onClick={() => handleQuizClick(job.jobTitle)}
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">
                You have not applied for any jobs yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
