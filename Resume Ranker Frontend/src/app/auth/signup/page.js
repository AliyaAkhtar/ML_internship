"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";


export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("handleSignup function triggered"); // Log function trigger

    try {
      const response = await fetch("https://localhost:7130/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
          name,
        }),
      });

      console.log(response);

      if (response.ok) {
        // Successful registration
        // alert("Signup successful! Please log in.");
        // router.push("/auth/login");
        toast.success("Signup successful! Please log in..");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else if (response.status === 400) {
        // Email already registered
        toast.error("Email is already registered. Please use a different email.");
        // alert("Email is already registered. Please log in or use a different email.");
      } else {
        // Other errors
        // alert("Signup failed. Please try again.");
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // alert("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 bg-opacity-60 backdrop-blur-md text-blue-900">
      {/* Toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-md p-8 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-xl relative">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-900">Create an Account</h1>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
              🧑‍💻
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-9 py-3 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 placeholder-gray-200"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
              ✉️
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-9 py-3 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 placeholder-gray-200"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
              🔒
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-9 py-3 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 placeholder-gray-200"
            />
          </div>

          {/* Role Select Field */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
              🛠️
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-9 py-3 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900 placeholder-gray-200"
            >
              <option value="candidate">Candidate</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-600 hover:to-blue-900 rounded-lg text-lg font-semibold tracking-wide text-white transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Signup
          </button>
        </form>

        {/* Login Prompt */}
        <p className="text-center text-gray-200 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-900 hover:underline transition duration-200">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
