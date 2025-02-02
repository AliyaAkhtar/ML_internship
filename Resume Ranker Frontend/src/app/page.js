"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

export default function HomePage() {
  useEffect(() => {
    const handleScroll = () => {
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (elementTop < windowHeight - revealPoint) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-gray-50 min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-fixed bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-purple-900 opacity-80"></div>
        <div className="relative z-10 text-center text-white px-12 py-16 max-w-3xl bg-black bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg transition-transform hover:scale-105 animate-fadeInUp">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-6">
            Welcome to <span className="text-pink-400">Recruitment Portal</span>
          </h1>
          <p className="text-xl font-medium leading-relaxed mb-8">
            Your ultimate destination for connecting top talent with great opportunities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/login">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-lg hover:from-purple-600 hover:to-blue-500 transform hover:-translate-y-1">
                Get Started
              </button>
            </Link>
            <img
              src="/images/team-work.png"
              alt="Teamwork"
              className="w-20 h-20 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-80">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            About <span className="text-blue-500">Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            At Recruitment Portal, we bridge the gap between employers and potential employees, providing seamless recruitment solutions.
          </p>
          <div className="flex justify-center">
            <div className="w-96 bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl">
              <p className="text-gray-800">
                Whether you are hiring for your next big project or finding your dream job, our platform ensures a fast, user-friendly, and reliable process.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      {/* Features Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-12">
            Why Choose <span className="text-blue-500">Us?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center items-center">
            {[
              { title: "Easy Hiring", text: "Simplify your hiring process.", image: "/images/feature1.jpeg" },
              { title: "Wide Talent Pool", text: "Access diverse talent.", image: "/images/feature2.jpeg" },
              { title: "Advanced Matching", text: "Find the best fit.", image: "/images/feature3.jpeg" },
            ].map(({ title, text, image }) => (
              <div key={title} className="group bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
                <img src={image} alt={title} className="w-40 h-40 mx-auto mb-4 group-hover:scale-110 transition duration-300" />
                <h3 className="text-2xl font-bold text-blue-700 mb-2">{title}</h3>
                <p className="text-blue-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-10">
            What Our <span className="text-blue-500">Users Say</span>
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-8 overflow-x-auto no-scrollbar justify-center items-center">
              {[
                { name: "Jane Doe", text: "I found my dream job quickly!", role: "Job Seeker" },
                { name: "John Smith", text: "Recruitment has never been this easy!", role: "Employer" },
                { name: "Emily Wilson", text: "User-friendly and effective!", role: "Hiring Manager" },
              ].map(({ name, text, role }) => (
                <div key={name} className="bg-pink-50 p-6 h-30 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 w-80 ">
                  <p className="text-lg italic mb-4 text-pink-800">"{text}"</p>
                  <h4 className="text-xl font-bold text-pink-800">{name}</h4>
                  <span className="text-pink-800 text-sm">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-white text-center">
        <p className="animate-pulse">&copy; 2024 Recruitment Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
