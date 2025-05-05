import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../constants/config";
import Select from "react-select";

const GetQuestions = () => {
  const [sections, setSections] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/admin/get-all-questions/`)
      .then((res) => {
        setSections(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load questions");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSection = (label) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  const toggleAnswers = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const groupedByCompany = () => {
    const grouped = {};
    sections.forEach((section) => {
      const companyId = section.company_id;
      if (!grouped[companyId]) {
        grouped[companyId] = {
          companyId,
          companyName: section.company_name || "Unknown Company",
          sections: [],
        };
      }
      grouped[companyId].sections.push(section);
    });
    return Object.values(grouped);
  };

  const visibleCompanyData = groupedByCompany().find(
    (g) => g.companyId == selectedCompanyId
  );

  const handleExport = () => {
    if (!visibleCompanyData) return;

    let exportText = "Question,Average Rating,User Name,User Email,Rating,Answer,Submitted On\n";
    visibleCompanyData.sections.forEach((section) => {
      section.questions.forEach((q) => {
        q.answers?.forEach((a) => {
          exportText += `"${q.question}","${q.avg_rating ?? "N/A"}","${a.user_name ?? "N/A"}","${a.user_email ?? "N/A"}","${a.rating ?? "N/A"}","${a.answer?.replace(/"/g, '""') ?? "No feedback given"}","${a.submitted_at ?? "N/A"}"\n`;
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
  };

  const companyOptions = groupedByCompany().map((g) => ({
    value: g.companyId,
    label: g.companyName,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-black p-6 mt-16 md:mt-6">
      <h1 className="text-xl font-bold mb-4 text-center md:text-left">
        Please select a company
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="w-full md:w-1/3 z-0 md:z-40">
          <Select
            value={companyOptions.find((opt) => opt.value === selectedCompanyId)}
            onChange={(selected) => setSelectedCompanyId(selected.value)}
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

      {visibleCompanyData ? (
        visibleCompanyData.sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-10 border border-gray-300 rounded-lg shadow-sm">
            <div
              className="flex justify-between items-center bg-blue-50 px-4 py-3 cursor-pointer"
              onClick={() => toggleSection(section.label)}
            >
              <h3 className="text-lg font-semibold">
                Section {section.label}: {section.title}
              </h3>
              <div>
                <button className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-3 cursor-pointer">
                  Avg Rating: {section.avg_rating ?? "N/A"}
                </button>
                <button className="text-blue-600 font-bold text-xl cursor-pointer">
                  {expandedSection === section.label ? "−" : "+"}
                </button>
              </div>
            </div>

            {expandedSection === section.label && (
              <ul className="px-6 py-4">
                {(section.questions || []).map((q, qIndex) => (
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
                          Avg Rating: {q.avg_rating ?? "N/A"}
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
                              <p><strong>Rating:</strong> <span className="text-blue-700">{a.rating ?? "N/A"}</span></p>
                              <p><strong>Answer:</strong>{" "}
                                {a.answer?.trim() ? (
                                  a.answer
                                ) : (
                                  <span className="italic text-gray-500">No feedback given</span>
                                )}
                              </p>
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
        ))
      ) : null}
    </div>
  );
};

export default GetQuestions;