import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../../constants/config";
import { FiEdit } from "react-icons/fi";

const CreateQuestion = () => {
  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionTextPositive, setNewQuestionTextPositive] = useState("");
  const [newQuestionTextNegative, setNewQuestionTextNegative] = useState("");
  const [editTitleId, setEditTitleId] = useState(null);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedQuestionText, setEditedQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSectionId, setSavingSectionId] = useState(null);
  const [savingQuestionId, setSavingQuestionId] = useState(null);
  const [addingSection, setAddingSection] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/get-all-questions/`);
      setSections(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
    setLoading(false);
  };

 const handleAddSection = async () => {
  if (!newSectionTitle.trim()) return alert("Section title is required");
  try {
    setAddingSection(true);

    // Dynamically calculate next label
    const existingLabels = sections.map((sec) => sec.label);
    let nextLabel = "A";
    for (let i = 0; i < 26; i++) {
      const candidate = String.fromCharCode(65 + i); // 65 = 'A'
      if (!existingLabels.includes(candidate)) {
        nextLabel = candidate;
        break;
      }
    }

    await axios.post(`${API_BASE_URL}/admin/create-section/`, {
      label: nextLabel,
      title: newSectionTitle,
      company_id: 1,
    });

    setNewSectionTitle("");
    await fetchSections();
  } catch (err) {
    console.error("Error adding section:", err);
  }
  setAddingSection(false);
};


  const handleAddQuestion = async () => {
    if (!selectedSectionId || !newQuestion.trim()) return;
    try {
      setAddingQuestion(true);
      await axios.post(`${API_BASE_URL}/admin/create-question/`, {
        section_id: selectedSectionId,
        question: newQuestion,
        positive_rating_text: newQuestionTextPositive,
        negative_rating_text: newQuestionTextNegative,
      });
      setNewQuestion("");
      setNewQuestionTextPositive("");
      setNewQuestionTextNegative("");
      await fetchSections();
    } catch (err) {
      console.error("Error adding question:", err);
    }
    setAddingQuestion(false);
  };

  const handleEditTitleSave = async (section_id) => {
    if (!editedTitle.trim()) return;
    setSavingSectionId(section_id);
    try {
      await axios.put(`${API_BASE_URL}/admin/update-section-title/${section_id}`, {
        title: editedTitle,
      });
      setEditTitleId(null);
      await fetchSections();
    } catch (err) {
      console.error("Error saving section title:", err);
    }
    setSavingSectionId(null);
  };

  const handleEditQuestionSave = async (question, sectionId) => {
    const positiveText = question.editingRatingPosText ?? question.rating_3_text;
    const negativeText = question.editingRatingNegText ?? question.rating_neg3_text;
    if (!editedQuestionText.trim()) return;
    setSavingQuestionId(question.question_id);
    try {
      await axios.put(`${API_BASE_URL}/admin/update-question/${question.question_id}`, {
        question: editedQuestionText,
        section_id: sectionId,
        positive_rating_text: positiveText,
        negative_rating_text: negativeText,
      });
      setEditQuestionId(null);
      await fetchSections();
    } catch (err) {
      console.error("Error saving question:", err);
    }
    setSavingQuestionId(null);
  };

  const handleDeleteSection = async (section_id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/delete-section/${section_id}`);
      await fetchSections();
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const handleDeleteQuestion = async (question_id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/delete-question/${question_id}`);
      await fetchSections();
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <div className="py-10 px-4 max-w-5xl mx-auto w-full">
      <h2 className="text-xl font-bold mb-3 text-center md:text-left">Add Section</h2>

      <input
        placeholder="New Section Title"
        value={newSectionTitle}
        onChange={(e) => setNewSectionTitle(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleAddSection}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 cursor-pointer"
        disabled={addingSection}
      >
        {addingSection ? "🔄 Adding..." : "+ Add Section"}
      </button>
      <p className="text-xl font-bold mb-3 text-center md:text-left text-black">Add Questions</p>
      <select
        value={selectedSectionId}
        onChange={(e) => setSelectedSectionId(e.target.value)}
        className="border p-2 w-full mb-2 rounded cursor-pointer"
      >
        <option value="">-- Select Section to Add Question --</option>
        {sections.map((section) => (
          <option key={section.section_id} value={section.section_id}>
            Section {section.label}: {section.title}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Enter question"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        placeholder="+3 Rating Text"
        value={newQuestionTextPositive}
        onChange={(e) => setNewQuestionTextPositive(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        placeholder="-3 Rating Text"
        value={newQuestionTextNegative}
        onChange={(e) => setNewQuestionTextNegative(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleAddQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        disabled={addingQuestion}
      >
        {addingQuestion ? "🔄 Adding..." : "+ Add Question"}
      </button>
      <p className="text-xl font-bold mt-4 text-center md:text-left text-black">Modify Questions</p>

      {sections.map((section) => (
        <div key={section.section_id} className="mt-8 border rounded p-4 bg-gray-100">
          <div className="flex justify-between items-center mb-2">
            {editTitleId === section.section_id ? (
              <div className="flex w-full gap-2">
                <input
                  className="border px-2 py-1 rounded grow"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button
                  onClick={() => handleEditTitleSave(section.section_id)}
                  className="text-green-600 cursor-pointer"
                >
                  {savingSectionId === section.section_id ? "🔄" : "✅"}
                </button>
              </div>
            ) : (
              <h3 className="font-bold">
                Section {section.label}: {section.title}
                <button
                  onClick={() => {
                    setEditTitleId(section.section_id);
                    setEditedTitle(section.title);
                  }}
                  className="ml-2 text-blue-600 cursor-pointer"
                >
                  <FiEdit />
                </button>
              </h3>
            )}
            <button
              onClick={() => handleDeleteSection(section.section_id)}
              className="text-red-600 text-sm cursor-pointer"
            >
              Delete
            </button>
          </div>

          {section.questions.map((q, qIndex) => (
            <div key={q.question_id} className="bg-white p-3 rounded border mb-2">
              {editQuestionId === q.question_id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="border p-2 rounded"
                    value={editedQuestionText}
                    onChange={(e) => setEditedQuestionText(e.target.value)}
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="+3 Rating"
                    value={q.editingRatingPosText ?? q.rating_3_text}
                    onChange={(e) => {
                      const updated = [...sections];
                      const sec = updated.find(s => s.section_id === section.section_id);
                      const ques = sec.questions.find(qq => qq.question_id === q.question_id);
                      ques.editingRatingPosText = e.target.value;
                      setSections(updated);
                    }}
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="-3 Rating"
                    value={q.editingRatingNegText ?? q.rating_neg3_text}
                    onChange={(e) => {
                      const updated = [...sections];
                      const sec = updated.find(s => s.section_id === section.section_id);
                      const ques = sec.questions.find(qq => qq.question_id === q.question_id);
                      ques.editingRatingNegText = e.target.value;
                      setSections(updated);
                    }}
                  />
                  <button
                    onClick={() => handleEditQuestionSave(q, section.section_id)}
                    className="text-green-600 text-sm text-right cursor-pointer"
                  >
                    {savingQuestionId === q.question_id ? "🔄 Saving..." : "✅ Save"}
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Q{qIndex + 1}:</strong> {q.question}</p>
                    <p className="text-green-600 text-sm">+3: {q.rating_3_text}</p>
                    <p className="text-red-600 text-sm">-3: {q.rating_neg3_text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditQuestionId(q.question_id);
                        setEditedQuestionText(q.question);
                      }}
                      className="text-blue-600 cursor-pointer"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.question_id)}
                      className="text-red-600 text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CreateQuestion;
