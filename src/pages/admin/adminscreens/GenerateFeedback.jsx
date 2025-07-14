import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import API_BASE_URL from "../../../constants/config";

const GenerateFeedback = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/get-companies`)
      .then((res) => {
        const formatted = res.data.map((company) => ({
          label: company.name,
          value: company.id,
        }));
        setCompanies(formatted);
      })
      .catch(() => alert("Failed to load companies"));
  }, []);

  const handleGenerateCompanyReport = async (e) => {
    e.preventDefault();
    if (!selectedCompany) return alert("Please select a company");
    setLoadingReport(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/generate-feedback-by-company/${selectedCompany.value}`
      );
      if (res.data.error || !res.data.report) {
        alert(res.data.message || "No feedback found");
        setReport(null);
      } else {
        setReport(res.data);
      }
    } catch (err) {
      console.error("Generate Feedback Error:", err);
      alert("Something went wrong while generating feedback.");
      setReport(null);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownload = async (format) => {
    if (!selectedCompany) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/download-feedback-report/${selectedCompany.value}?format=${format}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], {
        type: format === "pdf" ? "application/pdf" : "text/csv;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `feedback_report_${selectedCompany.label}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to download report.");
    }
  };

  return (
    <div className="p-6 text-black mt-16 md:mt-6 font-['Readex_Pro']">
      <h2 className="text-2xl font-bold mb-4"style={{ fontFamily: "Montserrat", fontWeight: 600 }}>
        Generate Feedback Summary for a Company
      </h2>

      <div className="mb-4">
        <Select
          options={companies}
          value={selectedCompany}
          onChange={setSelectedCompany}
          placeholder="-- Select Company --"
          className="text-black bg-green-50"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#f3f4f6",
              minHeight: 44,
              borderRadius: 6,
              borderColor: "#D1D5DB",
              boxShadow: "none",
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? "#E5E7EB" : "#D1D5DB",
              color: "#000",
              cursor: "pointer",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#D1D5DB",
              zIndex: 9999,
            }),
            singleValue: (base) => ({
              ...base,
              color: "#000",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#4B5563",
            }),
          }}
          menuPortalTarget={document.body}
        />
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <button
          onClick={handleGenerateCompanyReport}
          className=" text-white px-6 py-2 rounded cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: '#548B51' }}
          disabled={loadingReport}
        >
          {loadingReport ? "Generating..." : "Generate Feedback"}
        </button>

        {loadingReport && (
          <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        )}

        {report && !loadingReport && (
          <button
            onClick={() => handleDownload("pdf")}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 cursor-pointer"
          >
            Download PDF
          </button>
        )}
      </div>

      {report && (
        <div className="mt-6 border border-gray-300 rounded p-4 bg-green-50">
          <h3 className="text-lg font-semibold mb-2">
            Company: {report.company}
          </h3>
          <p className="font-semibold">
            Average Rating: {report.average_rating}
          </p>

          <div className="mt-4 whitespace-pre-wrap">
            <h4 className="font-semibold mb-1">Summary:</h4>
            <div className="text-gray-800">{report.summary}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateFeedback;
