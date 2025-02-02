"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams?.get("jobTitle") || ""; // Get the job title from the URL

  const [quizData, setQuizData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7130/api/Quiz/${encodeURIComponent(jobTitle)}`
        );
        if (!response.ok) throw new Error("Failed to fetch quiz questions");

        const data = await response.json();
        setQuizData(data.questions || {});
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
      setLoading(false);
    };

    if (jobTitle) {
      fetchQuizData();
    }
  }, [jobTitle]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-800">
        {decodeURIComponent(jobTitle)} Quiz
      </h1>

      <div className="mt-6 space-y-6">
        {Object.entries(quizData).length > 0 ? (
          Object.entries(quizData).map(([category, questions]) => (
            <div key={category} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-600 capitalize">
                {category.replace("_", " ")} Questions
              </h2>
              <div className="mt-4 space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-medium">{question.question}</p>
                    <ul className="mt-2 space-y-2">
                      {question.options.map((option, i) => (
                        <li key={i} className="p-2 border rounded-md bg-gray-200">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No quiz data available.</p>
        )}
      </div>
    </div>
  );
}
