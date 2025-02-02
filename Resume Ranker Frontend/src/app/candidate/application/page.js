// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ApplicationPage({ params }) {
//   const [candidateName, setCandidateName] = useState("");
//   const [candidateEmail, setCandidateEmail] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [resume, setResume] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const jobId = searchParams.get("jobId");
//   const [username, setUsername] = useState("");
//   const [candidateId, setCandidateId] = useState(null);

//   // Retrieve user details
//     useEffect(() => {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const { id, username } = JSON.parse(storedUser);
//         console.log("Username:", username);
//         console.log("ID:", id);
//         setUsername(username);
//         setCandidateId(id);
//       }
//     }, []);

//     const handleLogout = () => {
//       localStorage.clear();
//       window.location.href = "/auth/login";
//     };


//   const handleFileChange = (e) => {
//     setResume(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const candidate = JSON.parse(localStorage.getItem("user"));
//     if (!candidate || !candidate.id) {
//       alert("Candidate not found. Please log in again.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("JobId", jobId);
//     formData.append("CandidateId", candidate.id);
//     formData.append("CandidateName", candidateName);
//     formData.append("CandidateEmail", candidateEmail);
//     formData.append("Resume", resume);
//     formData.append("CoverLetter", coverLetter);

//     try {
//       const response = await fetch("https://localhost:7130/api/application/apply", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         alert("Application submitted successfully!");
//         router.push("/candidate");
//       } else {
//         const errorData = await response.json();
//         console.error("Failed to apply:", errorData);
//         alert("Failed to apply. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error submitting the application:", err);
//       alert("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-1/5 bg-gradient-to-br from-blue-500 via-[#9e99ff] to-purple-600 text-white p-4 flex flex-col">
//         <div className="flex items-center space-x-4 mb-8">
//           <div className="w-12 h-12 bg-white text-blue-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
//             {username[0]}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">{username || "HR User"}</h2>
//             <p className="text-sm text-gray-300">Candidate</p>
//           </div>
//         </div>
//         <nav>
//           <ul className="space-y-4">
//             <li
//               className="hover:text-blue-900 cursor-pointer"
//               onClick={() => router.push("/candidate")}
//             >
//               Dashboard
//             </li>
//             <li
//               className="hover:text-blue-900 cursor-pointer"
//               onClick={() => router.push("/candidate/applied-jobs")}
//             >
//               Applied Jobs
//             </li>
//             <li className="hover:text-blue-900 cursor-pointer">Settings</li>
//             <li
//               className="hover:text-blue-900 cursor-pointer"
//               onClick={handleLogout}
//             >
//               Logout
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-8 ml-[1%]">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold mb-2">Apply for Job</h1>
//           <button
//               onClick={() => router.push("/candidate")}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Back to Jobs
//             </button>
//         </header>

//         <form className="bg-white shadow rounded-lg p-6 space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Name:</label>
//             <input
//               type="text"
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               value={candidateName}
//               onChange={(e) => setCandidateName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Email:</label>
//             <input
//               type="email"
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               value={candidateEmail}
//               onChange={(e) => setCandidateEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Cover Letter:</label>
//             <textarea
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               value={coverLetter}
//               onChange={(e) => setCoverLetter(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Resume:</label>
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               onChange={handleFileChange}
//               required
//             />
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="w-48 p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 "
//             >
//               Submit Application
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ApplicationPage({ params }) {
//   const [candidateName, setCandidateName] = useState("");
//   const [candidateEmail, setCandidateEmail] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [resume, setResume] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);  // Added loading state
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const jobId = searchParams.get("jobId");
//   const [username, setUsername] = useState("");
//   const [candidateId, setCandidateId] = useState(null);

//   // Retrieve user details
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const { id, username } = JSON.parse(storedUser);
//       console.log("Username:", username);
//       console.log("ID:", id);
//       setUsername(username);
//       setCandidateId(id);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/auth/login";
//   };

//   const handleFileChange = (e) => {
//     setResume(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);  // Set loading state to true when form is submitted

//     const candidate = JSON.parse(localStorage.getItem("user"));
//     if (!candidate || !candidate.id) {
//       alert("Candidate not found. Please log in again.");
//       setLoading(false);  // Set loading state back to false if there's an issue
//       return;
//     }

//     const formData = new FormData();
//     formData.append("JobId", jobId);
//     formData.append("CandidateId", candidate.id);
//     formData.append("CandidateName", candidateName);
//     formData.append("CandidateEmail", candidateEmail);
//     formData.append("Resume", resume);
//     formData.append("CoverLetter", coverLetter);

//     try {
//       const response = await fetch("https://localhost:7130/api/application/apply", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         alert("Application submitted successfully!");
//         router.push("/candidate");
//       } else {
//         const errorData = await response.json();
//         console.error("Failed to apply:", errorData);
//         alert("Failed to apply. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error submitting the application:", err);
//       alert("An error occurred. Please try again later.");
//     } finally {
//       setLoading(false);  // Set loading state back to false after submission finishes
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-1/5 bg-gradient-to-br from-blue-500 via-[#9e99ff] to-purple-600 text-white p-4 flex flex-col">
//         <div className="flex items-center space-x-4 mb-8">
//           <div className="w-12 h-12 bg-white text-blue-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
//             {username[0]}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">{username || "HR User"}</h2>
//             <p className="text-sm text-gray-300">Candidate</p>
//           </div>
//         </div>
//         <nav>
//           <ul className="space-y-4">
//             <li className="hover:text-blue-900 cursor-pointer" onClick={() => router.push("/candidate")}>Dashboard</li>
//             <li className="hover:text-blue-900 cursor-pointer" onClick={() => router.push("/candidate/applied-jobs")}>Applied Jobs</li>
//             <li className="hover:text-blue-900 cursor-pointer">Settings</li>
//             <li className="hover:text-blue-900 cursor-pointer" onClick={handleLogout}>Logout</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-8 ml-[1%]">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold mb-2">Apply for Job</h1>
//           <button
//             onClick={() => router.push("/candidate")}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Back to Jobs
//           </button>
//         </header>

//         <form className="bg-white shadow rounded-lg p-6 space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Name:</label>
//             <input
//               type="text"
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               value={candidateName}
//               onChange={(e) => setCandidateName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Email:</label>
//             <input
//               type="email"
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               value={candidateEmail}
//               onChange={(e) => setCandidateEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Cover Letter:</label>
//             <textarea
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               value={coverLetter}
//               onChange={(e) => setCoverLetter(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Resume:</label>
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               onChange={handleFileChange}
//               required
//             />
//           </div>


//           <div className="flex justify-center items-center">
//             {loading && (
//               <div className="mr-4">
//                 {/* Spinner */}
//                 <svg
//                   className="animate-spin h-6 w-6 text-blue-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 0116 0v4H4v-4z"
//                   ></path>
//                 </svg>
//               </div>
//             )}
//             <button
//               type="submit"
//               className={`w-48 p-3 bg-blue-600 text-white font-bold rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
//                 }`}
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "Submit Application"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ApplicationPage({ params }) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [username, setUsername] = useState("");
  const [candidateId, setCandidateId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { id, username } = JSON.parse(storedUser);
      setUsername(username);
      setCandidateId(id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const candidate = JSON.parse(localStorage.getItem("user"));
    if (!candidate || !candidate.id) {
      alert("Candidate not found. Please log in again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("JobId", jobId);
    formData.append("CandidateId", candidate.id);
    formData.append("CandidateName", candidateName);
    formData.append("CandidateEmail", candidateEmail);
    formData.append("Resume", resume);
    formData.append("CoverLetter", coverLetter);

    try {
      const response = await fetch("https://localhost:7130/api/application/apply", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Application submitted successfully!");
        router.push("/candidate");
      } else {
        const errorData = await response.json();
        alert("Failed to apply. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-1/5 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-white p-6 flex flex-col items-center md:items-start">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {username[0]}
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold">{username || "Candidate"}</h2>
            <p className="text-sm text-gray-300">Candidate</p>
          </div>
        </div>
        <nav className="w-full">
          <ul className="space-y-4 text-center md:text-left">
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => router.push("/candidate")}
            >
              Dashboard
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => router.push("/candidate/applied-jobs")}
            >
              Applied Jobs
            </li>
            <li className="hover:text-gray-300 cursor-pointer">Settings</li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-10">
        <header className="flex justify-between items-center mb-7">
          <h1 className="text-3xl font-bold text-gray-700">Apply for Job</h1>
          <button
            onClick={() => router.push("/candidate")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Jobs
          </button>
        </header>

        <form
          className="bg-white shadow-md rounded-lg p-7 space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name:</label>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email:</label>
            <input
              type="email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Cover Letter:</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Resume:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="flex justify-center items-center">
            {loading && (
              <div className="mr-4">
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
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
