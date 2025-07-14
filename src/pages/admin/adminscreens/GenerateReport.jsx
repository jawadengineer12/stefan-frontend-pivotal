import axios from "axios";
import API_BASE_URL from "../../../constants/config";

const GenerateReport = () => {
  const handleGenerate = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/generate-collective-report/`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "collective_feedback_report.txt");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to generate report");
    }
  };

  return (
    <div className="p-6 text-black mt-16 md:mt-6 font-['Readex_Pro']">
      <h2 className="text-xl font-bold mb-4"style={{ fontFamily: "Montserrat", fontWeight: 600 }}>
        Generate Feedback Report
      </h2>
      <button
        onClick={handleGenerate}
        className=" text-white px-4 py-2 rounded cursor-pointer"
        style={{ backgroundColor: '#548B51' }}
      >
        Download Report
      </button>
    </div>
  );
};

export default GenerateReport;
