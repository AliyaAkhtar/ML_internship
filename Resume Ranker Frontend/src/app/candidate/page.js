// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function CandidatesPage() {
//   const [jobs, setJobs] = useState([]); // Available jobs
//   const [appliedJobs, setAppliedJobs] = useState([]); // Applied jobs
//   const [username, setUsername] = useState("");
//   const [candidateId, setCandidateId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   // Retrieve user details
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const { id, username } = JSON.parse(storedUser);
//       setUsername(username);
//       setCandidateId(id);
//     }
//   }, []);

//   // Fetch available jobs
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch(`https://localhost:7130/api/jobs/allJobs`);
//         if (response.ok) {
//           const data = await response.json();
//           setJobs(data);
//         } else {
//           console.error("Failed to fetch jobs");
//         }
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       }
//       setLoading(false);
//     };

//     fetchJobs();
//   }, []);

//   // Fetch applied jobs
//   useEffect(() => {
//     if (candidateId) {
//       const fetchAppliedJobs = async () => {
//         try {
//           const response = await fetch(
//             `https://localhost:7130/api/application/candidate/${candidateId}`
//           );
//           if (response.ok) {
//             const data = await response.json();
//             setAppliedJobs(data);
//           } else {
//             console.error("Failed to fetch applied jobs");
//           }
//         } catch (error) {
//           console.error("Error fetching applied jobs:", error);
//         }
//       };

//       fetchAppliedJobs();
//     }
//   }, [candidateId]);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/auth/login";
//   };

//   const handleApply = (jobId) => {
//     if (!candidateId) {
//       alert("Candidate ID is missing. Please log in again.");
//       return;
//     }
//     router.push(`/candidate/application?jobId=${jobId}`);
//   };

//   const handleViewMore = () => {
//     router.push("/candidate/applied-job");
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="flex h-screen">
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
//               onClick={() => router.push("/candidate/applied-job")}
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
//       <main className="w-4/5 bg-gray-100 p-6 overflow-y-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Available Jobs</h1>
//         <div className="grid grid-cols-1 gap-4">
//           {jobs.length > 0 ? (
//             jobs.map((job) => (
//               <div
//                 key={job.id}
//                 className="bg-white p-4 shadow rounded hover:bg-gray-50"
//               >
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   {job.title}
//                 </h2>
//                 <p className="text-gray-600">{job.description}</p>
//                 <p className="text-gray-500 text-sm">Location: {job.location}</p>
//                 <p className="text-gray-500 text-sm">Salary: {job.salary}</p>
//                 <button
//                   className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                   onClick={() => handleApply(job.id)}
//                 >
//                   Apply
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No jobs are currently available.</p>
//           )}
//         </div>

//         <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
//           Recently Applied Jobs
//         </h2>
//         <div className="grid grid-cols-1 gap-4">
//           {appliedJobs.slice(0, 4).map((job) => (
//             <div
//               key={job.applicationId}
//               className="bg-white p-4 shadow rounded hover:bg-gray-50"
//             >
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {job.jobTitle}
//               </h3>
//               <p className="text-gray-600">{job.jobDescription}</p>
//               <p className="text-gray-500 text-sm">
//                 Applied On: {new Date(job.appliedOn).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>
//         {appliedJobs.length > 4 && (
//           <button
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             onClick={handleViewMore}
//           >
//             View More
//           </button>
//         )}
//       </main>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation"; 

// export default function CandidatesPage() {
//   const [jobs, setJobs] = useState([]); // Available jobs
//   const [appliedJobs, setAppliedJobs] = useState([]); // Applied jobs
//   const [username, setUsername] = useState("");
//   const [candidateId, setCandidateId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();
//   const pathname = usePathname(); 

//   // Function to determine active class
//   const isActive = (path) => pathname === path ? "text-blue-900 font-bold" : "";

//   // Retrieve user details
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const { id, username } = JSON.parse(storedUser);
//       setUsername(username);
//       setCandidateId(id);
//     }
//   }, []);

//   // Fetch available jobs
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch(`https://localhost:7130/api/jobs/allJobs`);
//         if (response.ok) {
//           const data = await response.json();
//           setJobs(data);
//         } else {
//           console.error("Failed to fetch jobs");
//         }
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       }
//       setLoading(false);
//     };

//     fetchJobs();
//   }, []);

//   // Fetch applied jobs
//   useEffect(() => {
//     if (candidateId) {
//       const fetchAppliedJobs = async () => {
//         try {
//           const response = await fetch(
//             `https://localhost:7130/api/application/candidate/${candidateId}`
//           );
//           if (response.ok) {
//             const data = await response.json();
//             setAppliedJobs(data);
//           } else {
//             console.error("Failed to fetch applied jobs");
//           }
//         } catch (error) {
//           console.error("Error fetching applied jobs:", error);
//         }
//       };

//       fetchAppliedJobs();
//     }
//   }, [candidateId]);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/auth/login";
//   };

//   const handleApply = (jobId) => {
//     if (!candidateId) {
//       alert("Candidate ID is missing. Please log in again.");
//       return;
//     }
//     router.push(`/candidate/application?jobId=${jobId}`);
//   };

//   const handleViewMore = () => {
//     router.push("/candidate/applied-job");
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="flex h-screen">
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
//               className= { `hover:text-blue-900 cursor-pointer ${isActive("/candidate")}`}
//               onClick={() => router.push("/candidate")}
//             >
//               Dashboard
//             </li>
//             <li
//               className={`hover:text-blue-900 cursor-pointer ${isActive("/candidate/applied-job")}`}
//               onClick={() => router.push("/candidate/applied-job")}
//             >
//               Applied Jobs
//             </li>
//             <li className={`hover:text-blue-900 cursor-pointer ${isActive("/candidate/settings")}`}
//               onClick={() => router.push("/candidate/settings")}
//             >
//               Settings
//             </li>
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
//       <main className="w-4/5 bg-gray-100 p-6 overflow-y-auto">
//         {/* Applied Jobs */}
//         <section className="mb-12">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Applied Jobs</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {appliedJobs.slice(0, 4).map((job) => (
//               <div
//                 key={job.applicationId}
//                 className="bg-white p-4 shadow rounded hover:bg-gray-50"
//               >
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {job.jobTitle}
//                 </h3>
//                 <p className="text-gray-600">{job.jobDescription}</p>
//                 <p className="text-gray-500 text-sm">
//                   Applied On: {new Date(job.appliedOn).toLocaleDateString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//           {appliedJobs.length > 4 && (
//             <button
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//               onClick={handleViewMore}
//             >
//               View More
//             </button>
//           )}
//         </section>

//         {/* Available Jobs */}
//         <section>
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Available Jobs</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {jobs.length > 0 ? (
//               jobs.map((job) => (
//                 <div
//           key={job.id}
//           className="bg-white p-6 shadow rounded hover:bg-gray-50 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
//         >
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {job.title}
//                   </h3>
//                   <p className="text-gray-600">{job.description}</p>
//                   <p className="text-gray-500 text-sm">Location: {job.location}</p>
//                   <p className="text-gray-500 text-sm">Salary: {job.salary}</p>
//                   <button
//                     className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//                     onClick={() => handleApply(job.id)}
//                   >
//                     Apply
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-600">No jobs are currently available.</p>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function CandidatesPage() {
  const [jobs, setJobs] = useState([]);
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
    const fetchJobs = async () => {
      try {
        const response = await fetch(`https://localhost:7130/api/jobs/allJobs`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      setLoading(false);
    };

    fetchJobs();
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
      };

      fetchAppliedJobs();
    }
  }, [candidateId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  const handleApply = (jobId) => {
    if (!candidateId) {
      alert("Candidate ID is missing. Please log in again.");
      return;
    }
    router.push(`/candidate/application?jobId=${jobId}`);
  };

  const handleViewMore = () => {
    router.push("/candidate/applied-job");
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
            Applied Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {appliedJobs.slice(0, 4).map((job) => (
              <div
                key={job.applicationId}
                className="bg-white p-6 shadow-md rounded-md hover:shadow-xl hover:bg-gray-100 transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {job.jobTitle}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {job.jobDescription}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Applied On:{" "}
                  {new Date(job.appliedOn).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          {appliedJobs.length > 4 && (
            <button
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 shadow-md rounded-md hover:shadow-xl hover:bg-gray-100 transition-transform duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                  {job.description}
                  </p>
                  <p className="text-gray-500 mt-1">Location: {job.location}</p>
                  <p className="text-gray-500 mt-1">Salary: {job.salary}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                    onClick={() => handleApply(job.id)}
                  >
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No jobs are currently available.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
