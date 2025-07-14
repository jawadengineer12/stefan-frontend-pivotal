import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../constants/config";

const CreateSectionWithQuestions = () => {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({ label: "", title: "" });

  const handleAddSection = () => {
    setSections([...sections, { ...currentSection, questions: [] }]);
    setCurrentSection({ label: "", title: "" });
  };

  const handleAddQuestion = (index) => {
    const updated = [...sections];
    updated[index].questions.push({ subject: "", question: "" });
    setSections(updated);
  };

  const handleChangeQuestion = (sIndex, qIndex, field, value) => {
    const updated = [...sections];
    updated[sIndex].questions[qIndex][field] = value;
    setSections(updated);
  };

  const handleSubmit = async () => {
    for (const section of sections) {
      const res = await axios.post(`${API_BASE_URL}/admin/create-section/`, {
        label: section.label,
        title: section.title,
      });

      for (const q of section.questions) {
        await axios.post(`${API_BASE_URL}/admin/create-question/`, {
          ...q,
          section_id: res.data.section_id,
        });
      }
    }
    alert("All sections and questions submitted!");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Sections and Questions</h2>

      <div className="mb-6">
        <input
          placeholder="Section Label (e.g., Section A)"
          value={currentSection.label}
          onChange={(e) => setCurrentSection({ ...currentSection, label: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          placeholder="Section Title (e.g., Topic AI)"
          value={currentSection.title}
          onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleAddSection} className=" text-white px-4 py-2 rounded"style={{ backgroundColor: "#548B51" }}>
          + Add Section
        </button>
      </div>

      {sections.map((section, sIndex) => (
        <div key={sIndex} className="mb-6 border p-4 rounded-lg bg-gray-100">
          <h3 className="font-bold mb-2">{section.label}: {section.title}</h3>
          {section.questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4">
              <input
                placeholder="Subject"
                value={q.subject}
                onChange={(e) => handleChangeQuestion(sIndex, qIndex, "subject", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <textarea
                placeholder="Question"
                value={q.question}
                onChange={(e) => handleChangeQuestion(sIndex, qIndex, "question", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          ))}
          <button
            onClick={() => handleAddQuestion(sIndex)}
            className="text-sm text-white px-3 py-1 rounded hover:brightness-90"
            style={{ backgroundColor: "#548B51" }}
          >
            + Add Question to {section.label}
          </button>
        </div>
      ))}

      <button onClick={handleSubmit} className=" text-white px-6 py-2 rounded"style={{ backgroundColor: "#548B51" }}>
        Submit All
      </button>
    </div>
  );
};

export default CreateSectionWithQuestions;
