import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../constants/config";
import { motion, AnimatePresence } from "framer-motion";

const Questionnaire = () => {
  const [sections, setSections] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/get-question/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { sections: fetchedSections } = response.data;

        const merged = fetchedSections
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((section) => ({
            ...section,
            questions: section.questions
              .map((q) => {
               const isBlank = !q.answer || q.answer === "blank";
                return {
                  ...q,
                  rating: q.rating ?? 0,
                  feedback: isBlank ? "" : q.answer,
                  cantAnswer: q.rating === 0 && isBlank,
                  rating_3_text: q.rating_3_text || "",
                  rating_neg3_text: q.rating_neg3_text || "",
                };
              })

              .sort((a, b) => {
                const numA = parseInt(a.question.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.question.match(/\d+/)?.[0] || 0);
                return numA - numB;
              }),
          }));

        setSections(merged);

      } catch (err) {
        console.error("Failed to load questions:", err);
      }
    };

    if (token) {
      fetchQuestions();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const isSectionComplete = (section) => {
    return section.questions.every(
      (q) => q.cantAnswer || q.rating !== 0 || q.feedback.trim() !== ""
    );
  };

  const handleRatingChange = (sIndex, qIndex, value) => {
    const updated = [...sections];
    const question = updated[sIndex].questions[qIndex];
    question.rating = value;
    question.cantAnswer = false;
    setSections(updated);
    saveSingleAnswer(question);
  };

  const handleFeedbackChange = (sIndex, qIndex, value) => {
    const updated = [...sections];
    const question = updated[sIndex].questions[qIndex];
    question.feedback = value;
    question.cantAnswer = false;
    setSections(updated);
    saveSingleAnswer(question);
  };

  const handleCantAnswerToggle = (sIndex, qIndex) => {
    const updated = [...sections];
    const question = updated[sIndex].questions[qIndex];
    question.cantAnswer = !question.cantAnswer;

    if (question.cantAnswer) {
      question.rating = 0;
      question.feedback = "";
    }

    setSections(updated);
    saveSingleAnswer(question);
  };

  const getSliderThumbColor = (rating) => {
    if (rating === -3) return "accent-red-800";
    if (rating === -2) return "accent-red-600";
    if (rating === -1) return "accent-red-400";
    if (rating === 1) return "accent-green-400";
    if (rating === 2) return "accent-green-600";
    if (rating === 3) return "accent-green-800";
    return "accent-gray-400";
  };

  const handleSubmit = async () => {
    if (!token) return alert("User not logged in.");
    setSubmitting(true);

    try {
      const allAnswers = sections.flatMap((section) =>
        section.questions.map((q) => ({
          question_id: q.question_id,
          answer: q.cantAnswer ? "" : q.feedback,
          rating: q.cantAnswer ? 0 : q.rating,
          submitted_at: new Date().toISOString(),
        }))
      );

      await axios.post(`${API_BASE_URL}/user/submit-answer/`, allAnswers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSubmitted(true);

      // 🔹 Clear localStorage after successful submit
      

      const companyId = localStorage.getItem("company_id");
      if (companyId) {
        const summaryRes = await axios.get(
          `${API_BASE_URL}/generate-feedback-by-company/${companyId}`
        );
        setSummary(summaryRes.data.summary);
      }
    } catch (err) {
      console.error("Error submitting answers:", err);
      alert("Failed to submit answers.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("company_id");
    navigate("/login");
  };

  const formatSummary = (summary) => {
    return summary.split("\n").map((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-bold mt-4">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      if (/^\*\*(.+)\*\*:/.test(trimmed)) {
        const parts = trimmed.split("**").filter(Boolean);
        return (
          <p key={index} className="mt-2">
            <span className="font-semibold">{parts[0]}:</span>{" "}
            {parts.slice(1).join("")}
          </p>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <p key={index} className="ml-4 mt-2 text-sm">
            <span className="font-medium">{trimmed}</span>
          </p>
        );
      }

      if (/^-\s/.test(trimmed)) {
        return (
          <li key={index} className="ml-8 list-disc text-sm">
            {trimmed.replace(/^-/, "").trim()}
          </li>
        );
      }

      return (
        <p key={index} className="text-sm text-gray-800">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <section
      className="py-20 px-6 flex flex-col min-h-screen font-[Readex_Pro]"
      style={{ backgroundColor: "#E8E6DC" }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-3xl font-bold text-gray-800"
            style={{ fontFamily: "Montserrat", fontWeight: 600 }}
          >
            Questions
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-600 text-center mb-8">
          Your ratings and answers are saved step by step locally. You can
          always return to the answers and adjust them later.
        </p>

        {submitted && (
          <div className="text-center bg-white p-10 rounded shadow mb-8">
            <h3 className="text-2xl font-semibold text-[#548B51] mb-4">
              Thank you!
            </h3>
            <p className="text-gray-700">
              Your feedback has been submitted successfully. You may continue
              editing your answers if needed.
            </p>
          </div>
        )}

        {sections.map((section, sIndex) => (
          <div
            key={sIndex}
            className="mb-10 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div
              className="flex justify-between items-center px-6 py-4 cursor-pointer"
              style={{
                backgroundColor: isSectionComplete(section)
                  ? "#548B51"
                  : "#D1D5DB", // green if complete else grey
              }}
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.label ? null : section.label
                )
              }
            >
              <h3
                className={`text-xl font-bold ${
                  isSectionComplete(section) ? "text-white" : "text-black"
                }`}
              >
                Section {section.label}: {section.title}
              </h3>
              <span
                className={`text-2xl font-bold ${
                  isSectionComplete(section) ? "text-white" : "text-black"
                }`}
              >
                {expandedSection === section.label ? "−" : "+"}
              </span>
            </div>

            <AnimatePresence>
              {expandedSection === section.label && (
                <motion.div
                  className="px-6 py-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section.questions.map((question, qIndex) => (
                    <div
                      key={question.question_id}
                      className="border border-gray-200 rounded-lg p-6 mb-6"
                    >
                      <p className="text-lg font-medium text-gray-800 mb-4">
                        {question.question}
                      </p>

                      <div className="mb-4">
                        <label className="text-sm text-gray-800 flex items-center gap-2 mb-2 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={question.cantAnswer}
                              onChange={() =>
                                handleCantAnswerToggle(sIndex, qIndex)
                              }
                              className="peer appearance-none h-4 w-4 border border-gray-400 rounded bg-transparent cursor-pointer checked:bg-transparent"
                            />
                            <span className="absolute top-0 left-0 h-4 w-4 flex items-center justify-center text-xs font-bold text-black peer-checked:opacity-100 opacity-0 pointer-events-none">
                              ✔
                            </span>
                          </div>
                          I can’t answer this question
                        </label>
                      </div>

                      <div className="mb-6">
                        <input
                          type="range"
                          min="-3"
                          max="3"
                          step="1"
                          value={question.rating}
                          disabled={question.cantAnswer}
                          onChange={(e) =>
                            handleRatingChange(
                              sIndex,
                              qIndex,
                              parseInt(e.target.value)
                            )
                          }
                          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${getSliderThumbColor(
                            question.rating
                          )} bg-gray-300`}
                          style={{ WebkitAppearance: "none" }}
                        />
                        <div className="flex justify-between text-xs text-gray-700 mt-1 px-[2px]">
                          <span className="text-red-600">-3</span>
                          <span>-2</span>
                          <span>-1</span>
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span className="text-[#548B51]">+3</span>
                        </div>

                        <div className="flex justify-between text-xs text-black mt-1 min-h-[1rem]">
                          <span className="text-left text-[11px] text-red-600 w-1/2">
                            {question.rating_neg3_text?.trim()}
                          </span>
                          <span className="text-right text-[11px] text-[#548B51] w-1/2">
                            {question.rating_3_text?.trim()}
                          </span>
                        </div>
                      </div>

                      <textarea
                        placeholder="Please explain your rating..."
                        value={question.feedback}
                        disabled={question.cantAnswer}
                        onChange={(e) =>
                          handleFeedbackChange(sIndex, qIndex, e.target.value)
                        }
                        className="w-full mt-4 p-4 text-black rounded-md border border-gray-300 cursor-pointer bg-green-50"
                        rows="3"
                      ></textarea>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={` text-white px-8 py-3 rounded-lg hover:brightness-90 mt-6 font-semibold cursor-pointer ${
              submitting ? "opacity-50" : ""
            }`}
            style={{ backgroundColor: "#548B51" }}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>

        {summary && (
          <div className="mt-12 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">AI-Generated Summary</h3>
            <div className="space-y-2">{formatSummary(summary)}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Questionnaire;
//questions
