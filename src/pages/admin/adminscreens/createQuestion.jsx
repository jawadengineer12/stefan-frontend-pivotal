import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../../constants/config";
import { FiEdit } from "react-icons/fi";

const CreateQuestion = () => {
  const [companies, setCompanies] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newQuestionTextPositive, setNewQuestionTextPositive] = useState(""); // Add this line
  const [newQuestionTextNegative, setNewQuestionTextNegative] = useState(""); // Add this line
  const [editTitleId, setEditTitleId] = useState(null);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedQuestionText, setEditedQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSectionId, setSavingSectionId] = useState(null);
  const [savingQuestionId, setSavingQuestionId] = useState(null);
  const [savingSection, setSavingSection] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesRes, sectionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/get-companies`),
        axios.get(`${API_BASE_URL}/admin/get-all-questions/`),
      ]);
      setCompanies(companiesRes.data);
      setSections(sectionsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const getAvailableLabelForCompany = (companyId) => {
    const companySections = sections.filter((s) => s.company_id === companyId);
    const usedLabels = new Set(companySections.map((s) => s.label));
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let char of alphabet) {
      if (!usedLabels.has(char)) return char;
    }
    return "Z";
  };

  const handleAddSection = async () => {
    if (!selectedCompanyId || !newSectionTitle.trim()) return alert("Please complete all fields.");
    const label = getAvailableLabelForCompany(Number(selectedCompanyId));
    setSavingSection(true);
    try {
      await axios.post(`${API_BASE_URL}/admin/create-section/`, {
        label,
        title: newSectionTitle,
        company_id: selectedCompanyId,
      });
      setNewSectionTitle("");
      setSelectedSectionId("");
      await fetchData();
    } catch (err) {
      console.error("Error creating section:", err);
    }
    setSavingSection(false);
  };

  const handleAddQuestionToExisting = async () => {
    if (!selectedSectionId || !newQuestion.trim()) return alert("Please complete all fields.");
    setSavingQuestion(true);
    try {
      await axios.post(`${API_BASE_URL}/admin/create-question/`, {
        section_id: selectedSectionId,
        question: newQuestion,
        positive_rating_text: newQuestionTextPositive,  // Add positive rating text
        negative_rating_text: newQuestionTextNegative,  // Add negative rating text
      });
      setNewQuestion("");
      setNewQuestionTextPositive(""); // Reset the positive rating text
      setNewQuestionTextNegative(""); // Reset the negative rating text
      await fetchData();
    } catch (err) {
      console.error("Error adding question:", err);
    }
    setSavingQuestion(false);
  };

  const handleDeleteSection = async (section_id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    setSavingSection(true);
    try {
      await axios.delete(`${API_BASE_URL}/admin/delete-section/${section_id}`);
      await fetchData();
    } catch (err) {
      console.error("Error deleting section:", err);
    }
    setSavingSection(false);
  };

  const handleEditTitleSave = async (section_id) => {
    if (!editedTitle.trim()) return;
    setSavingSectionId(section_id);
    try {
      await axios.put(`${API_BASE_URL}/admin/update-section-title/${section_id}`, {
        title: editedTitle,
      });
      setEditTitleId(null);
      await fetchData();
    } catch (err) {
      console.error("Error saving section title:", err);
    }
    setSavingSectionId(null);
  };

  const handleEditQuestionSave = async (section_id, question_id) => {
    if (!editedQuestionText.trim()) return;
    setSavingQuestionId(question_id);
    try {
      await axios.put(`${API_BASE_URL}/admin/update-question/${question_id}`, {
        question: editedQuestionText,
        section_id,
      });
      setEditQuestionId(null);
      await fetchData();
    } catch (err) {
      console.error("Error saving question:", err);
    }
    setSavingQuestionId(null);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "Unknown Company";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 max-w-5xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Create / Edit Sections and Questions</h2>

      <select
        className="border p-2 w-full mb-2 rounded cursor-pointer"
        value={selectedCompanyId}
        onChange={(e) => setSelectedCompanyId(e.target.value)}
      >
        <option value="">-- Select Company --</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input
        placeholder="New Section Title"
        value={newSectionTitle}
        onChange={(e) => setNewSectionTitle(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleAddSection}
        disabled={savingSection}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto cursor-pointer hover:bg-blue-700"
      >
        {savingSection ? "Saving..." : "+ Add Section under Selected Company"}
      </button>

      <div className="mt-8">
        <select
          className="border p-2 w-full mb-2 rounded cursor-pointer"
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
        >
          <option value="">-- Select Section to Add Question --</option>
          {sections.filter(s => s.company_id === Number(selectedCompanyId)).map((s) => (
            <option key={s.section_id} value={s.section_id}>
              {getCompanyName(s.company_id)} → {s.label}: {s.title}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Enter new question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          placeholder="Enter text for +3 rating"
          className="border p-2 w-full mb-2 rounded"
          value={newQuestionTextPositive}
          onChange={(e) => setNewQuestionTextPositive(e.target.value)}
        />
        <input
          placeholder="Enter text for -3 rating"
          className="border p-2 w-full mb-2 rounded"
          value={newQuestionTextNegative}
          onChange={(e) => setNewQuestionTextNegative(e.target.value)}
        />
        <button
          onClick={handleAddQuestionToExisting}
          disabled={savingQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto cursor-pointer hover:bg-blue-700"
        >
          {savingQuestion ? "Saving..." : "+ Add Question to Selected Section"}
        </button>
      </div>

      {sections.filter(s => s.company_id === Number(selectedCompanyId)).map((section) => (
        <div key={section.section_id} className="mt-6 border p-4 rounded-lg bg-gray-100">
          <div className="flex items-center mb-2 flex-wrap gap-2">
            {editTitleId === section.section_id ? (
              <div className="flex gap-2 w-full sm:w-auto grow">
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  onClick={() => handleEditTitleSave(section.section_id)}
                  className="text-green-600 font-semibold cursor-pointer"
                >
                  ✅
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold grow">
                  {getCompanyName(section.company_id)} → Section {section.label}: {section.title}
                </h3>
              </>
            )}
            <div className="flex items-center gap-3">
              {editTitleId !== section.section_id && (
                <button
                  onClick={() => {
                    setEditTitleId(section.section_id);
                    setEditedTitle(section.title);
                  }}
                  className="text-blue-600 font-semibold cursor-pointer"
                >
                  <FiEdit />
                </button>
              )}
              <button
                onClick={() => handleDeleteSection(section.section_id)}
                className="text-red-600 font-semibold text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>

          {section.questions.map((q, qIndex) => (
            <div key={q.question_id} className="mb-2">
              {editQuestionId === q.question_id ? (
                <div className="flex items-center gap-2">
                  <textarea
                    value={editedQuestionText}
                    onChange={(e) => setEditedQuestionText(e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                  <button
                    onClick={() => handleEditQuestionSave(section.section_id, q.question_id)}
                    className="text-green-600 font-semibold cursor-pointer"
                  >
                    ✅
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center border p-2 bg-white rounded cursor-pointer">
                  <p>Q{qIndex + 1}: {q.question}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditQuestionId(q.question_id);
                        setEditedQuestionText(q.question);
                      }}
                      className="text-blue-600 font-semibold cursor-pointer"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteQuestion(q.question_id);
                      }}
                      className="text-red-600 font-semibold text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              {savingQuestionId === q.question_id && <span className="text-gray-500 text-sm">Saving...</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CreateQuestion;
