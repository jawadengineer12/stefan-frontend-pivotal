import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../constants/config";
import Select from "react-select";

const GetQuestions = () => {
  const [sections, setSections] = useState([]);
  const [expandedAll, setExpandedAll] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/get-companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  };

  const fetchCompanyQuestions = async (companyId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/get-questions-by-company/${companyId}`);
      setSections(res.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompanyQuestions(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  const toggleSection = () => {
    setExpandedAll((prev) => !prev);
  };

  const toggleAnswers = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

const handleExport = async () => {
  setLoading(true);
  try {
    let allSections = [];

    if (selectedCompanyId) {
      const res = await axios.get(`${API_BASE_URL}/admin/get-questions-by-company/${selectedCompanyId}`);
      allSections = res.data;
      const company = companies.find(c => c.id === selectedCompanyId);
      allSections.forEach((s) => (s.company_name = company?.name || "Unknown"));
    } else {
      const companyFetches = await Promise.all(
        companies.map(async (company) => {
          const res = await axios.get(`${API_BASE_URL}/admin/get-questions-by-company/${company.id}`);
          return res.data.map((s) => ({ ...s, company_name: company.name }));
        })
      );
      allSections = companyFetches.flat();
    }

    if (!allSections.length) {
      alert("No data available to export.");
      return;
    }

    // CSV Header
    let exportText = "Company Name,Section Label,Section Title,Question,Average Rating,Standard Deviation,User Name,User Email,Rating,Answer,Submitted On\n";

    // Sort sections alphabetically by section label
    allSections.sort((a, b) => a.label.localeCompare(b.label));

    // For each section, sort its questions alphabetically by question text
    allSections.forEach((section) => {
      section.questions.sort((q1, q2) => q1.question.localeCompare(q2.question));
    });

    // Build CSV rows by iterating over each section and its sorted questions
    allSections.forEach((section) => {
      section.questions.forEach((q) => {
        q.answers.forEach((a) => {
          const isBlankAnswer = !a.answer || a.answer.trim() === "";
          const answerText = isBlankAnswer ? "blank" : a.answer.replace(/"/g, '""');
          const rating = isBlankAnswer || a.rating == null ? "N/A" : a.rating;

          exportText += `"${section.company_name}","${section.label}","${section.title}","${q.question}","${q.avg_rating ?? "N/A"}","${q.std_dev ?? "N/A"}","${a.user_name ?? "N/A"}","${a.user_email ?? "N/A"}","${rating}","${answerText}","${a.submitted_at ?? "N/A"}"\n`;
        });
      });
    });

    const blob = new Blob([exportText], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "questions_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("CSV Export Error:", err);
    alert("Failed to export CSV.");
  } finally {
    setLoading(false);
  }
};




  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  return (
    <div className="w-full min-h-screen text-black p-6 mt-16 md:mt-6">
      <h1 className="text-xl font-bold mb-4 text-center md:text-left">
        Please select a company
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="w-full md:w-1/3 z-0 md:z-40">
          <Select
            value={companyOptions.find((opt) => opt.value === selectedCompanyId)}
            onChange={(selected) => {
              setExpandedAll(false);
              setSelectedCompanyId(selected.value);
            }}
            options={companyOptions}
            placeholder="-- Select Company --"
            className="text-black"
            menuPortalTarget={document.body}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#E5E7EB',
                color: '#000000',
                borderColor: '#E5E7EB',
                minHeight: 44,
                borderRadius: 6,
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? '#D1D5DB' : '#E5E7EB',
                color: '#000000',
                cursor: 'pointer',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#E5E7EB',
                zIndex: 9999,
              }),
              singleValue: (base) => ({
                ...base,
                color: '#000000',
              }),
              placeholder: (base) => ({
                ...base,
                color: '#4B5563',
              }),
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Export .CSV
        </button>
      </div>

    {loading ? (
  <div className="text-center text-gray-600">Loading questions...</div>
) : [...sections]
    .sort((a, b) => a.label.localeCompare(b.label)) // Sort sections alphabetically
    .map((section, sIndex) => (
        <div key={sIndex} className="mb-10 border border-gray-300 rounded-lg shadow-sm">
          <div
            className="flex justify-between items-center bg-blue-50 px-4 py-3 cursor-pointer"
            onClick={toggleSection}
          >
            <h3 className="text-lg font-semibold">
              Section {section.label}: {section.title}
            </h3>
            <div>
              <button className="text-blue-600 font-bold text-xl cursor-pointer">
                {expandedAll ? "−" : "+"}
              </button>
            </div>
          </div>

          {expandedAll && (
            <ul className="px-6 py-4">
              {[...section.questions || []]
  .sort((a, b) => {
    const numA = parseInt(a.label?.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.label?.match(/\d+/)?.[0] || 0);
    return numA - numB;
  })
  .map((q, qIndex) => (
                <li key={qIndex} className="border-b border-gray-200 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Q{qIndex + 1}: {q.question}</p>
                      <p className="text-sm text-gray-600">
                        Answered by {q.answers?.length || 0} user(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded cursor-pointer">
                        Avg: {q.avg_rating ?? "N/A"}
                      </button>
                      <button className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded cursor-pointer">
                        SD: {q.std_dev ?? "N/A"}
                      </button>
                      <button
                        onClick={() => toggleAnswers(q.question_id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                      >
                        {expandedQuestion === q.question_id ? "Hide Answers" : "View Answers"}
                      </button>
                    </div>
                  </div>

                  {expandedQuestion === q.question_id && (
                    <div className="mt-3 ml-2 space-y-2">
                      {q.answers?.length > 0 ? (
                        q.answers.map((a, idx) => (
                          <div key={idx} className="bg-gray-100 p-3 rounded shadow-sm text-sm">
                            <p><strong>User Name:</strong> <span className="text-blue-800">{a.user_name || "N/A"}</span></p>
                            <p><strong>User Email:</strong> <span className="text-blue-600">{a.user_email || "N/A"}</span></p>
                            <p><strong>Submitted on:</strong> <span className="text-gray-700">{a.submitted_at ? new Date(a.submitted_at).toLocaleString() : "N/A"}</span></p>
                            <p><strong>Rating:</strong> <span className="text-blue-700">{a.answer?.trim() ? (a.rating ?? "N/A") : "N/A"}</span></p>
                            <p><strong>Answer:</strong> {a.answer?.trim() ? a.answer : <span className="italic text-gray-500">blank</span>}</p>
                          </div>
                        ))
                      ) : (
                        <p className="italic text-gray-500">No answers available</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default GetQuestions;
