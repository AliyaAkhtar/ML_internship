// src/app/auth/login/page.js

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("handleLogin function triggered");

    try {
      const response = await fetch("https://localhost:7130/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
          })
        );

        if (data.role === "hr") {
          // alert("Successful login!");
          // router.push("/hr");
          toast.success("Login successful! Redirecting to HR dashboard...");
          setTimeout(() => router.push("/hr"), 2000);
        } else if (data.role === "candidate") {
          // router.push("/candidate");
          toast.success("Login successful! Redirecting to Candidate dashboard...");
          setTimeout(() => router.push("/candidate"), 2000);
        }
      } else if (response.status === 401) {
        toast.error("Invalid credentials. Please try again.");
        // alert("Invalid credentials. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
        // alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 bg-opacity-60 backdrop-blur-md text-blue-900">
      {/* Toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-xl relative">
        

        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-900">
          Welcome Back!
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Login to access your account.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-600 hover:to-blue-900 rounded-lg text-lg font-semibold tracking-wide text-white transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-200 mt-8">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-900 underline transition duration-200"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
