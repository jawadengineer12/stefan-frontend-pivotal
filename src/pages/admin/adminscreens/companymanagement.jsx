import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../constants/config";
import Select from "react-select";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState("");
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/get-companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.trim()) return alert("Company name is required");
    try {
      setSaving(true);
      await axios.post(`${API_BASE_URL}/admin/add-company`, newCompany, {
        headers: { "Content-Type": "application/json" },
      });
      setNewCompany("");
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding company");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      setDeleting(id);
      await axios.delete(`${API_BASE_URL}/admin/delete-company/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Company deleted successfully");
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Error deleting company");
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateCompany = async (id) => {
    if (!editCompanyName.trim()) return alert("Company name required");
    try {
      setSaving(true);
      await axios.put(`${API_BASE_URL}/admin/update-company/${id}`, editCompanyName, {
        headers: { "Content-Type": "application/json" },
      });
      setEditCompanyId(null);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Error updating company");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto w-full font-['Readex']">
      <h2 className="font-['Montserrat'] text-2xl font-bold mb-6 text-center md:text-left">Manage Companies</h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-green-50">
        <input
          placeholder="Enter new company name"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAddCompany}
          disabled={saving}
          className={`px-6 py-2 rounded text-white cursor-pointer ${
            saving ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving ? "Saving..." : "+ Add Company"}
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading companies...</div>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-gray-100 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center rounded"
            >
              {editCompanyId === company.id ? (
                <div className="flex flex-col sm:flex-row w-full gap-2">
                  <input
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={() => handleUpdateCompany(company.id)}
                    className={`px-4 py-2 rounded text-white cursor-pointer ${
                      saving ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-4">
                  <span className="font-semibold">{company.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditCompanyId(company.id);
                        setEditCompanyName(company.name);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className={`px-4 py-1 rounded text-white cursor-pointer ${
                        deleting === company.id ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
                      }`}
                      disabled={deleting === company.id}
                    >
                      {deleting === company.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
