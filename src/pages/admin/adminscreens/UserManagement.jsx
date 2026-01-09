import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import API_BASE_URL from "../../../constants/config";

const UserManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchUsersByCompany(selectedCompanyId);
    } else {
      setUsers([]);
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/get-companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      alert("Failed to load companies");
    }
  };

  const fetchUsersByCompany = async (companyId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/get-users-by-company/${companyId}`
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This will also delete all their answers. This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await axios.delete(`${API_BASE_URL}/admin/delete-user/${userId}`);
      alert("User deleted successfully");
      // Refresh the user list
      if (selectedCompanyId) {
        fetchUsersByCompany(selectedCompanyId);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.detail || "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const getStatusBadge = (user) => {
    if (user.completely_answered) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          ✓ Complete (100%)
        </span>
      );
    } else if (user.answered_count > 0) {
      const percentage = user.completion_percentage || (user.total_questions > 0 
        ? Math.round((user.answered_count / user.total_questions) * 100 * 10) / 10 
        : 0);
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          In Progress ({percentage}%)
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          Not Started (0%)
        </span>
      );
    }
  };

  return (
    <div className="w-full min-h-screen text-black p-6 mt-16 md:mt-6 font-['Readex_Pro']">
      <h1
        className="text-xl font-bold mb-4 text-center md:text-left"
        style={{ fontFamily: "Montserrat", fontWeight: 600 }}
      >
        User Management
      </h1>
      <p className="text-gray-600 mb-6">
        View users per company and their answer completion status
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Company
        </label>
        <div className="w-full md:w-1/3 z-0 md:z-40">
          <Select
            value={companyOptions.find(
              (opt) => opt.value === selectedCompanyId
            )}
            onChange={(selected) => {
              setSelectedCompanyId(selected?.value || null);
            }}
            options={companyOptions}
            placeholder="-- Select Company --"
            className="text-black"
            menuPortalTarget={document.body}
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#E5E7EB",
                color: "#000000",
                borderColor: "#E5E7EB",
                minHeight: 44,
                borderRadius: 6,
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? "#D1D5DB" : "#E5E7EB",
                color: "#000000",
                cursor: "pointer",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#E5E7EB",
                zIndex: 9999,
              }),
              singleValue: (base) => ({
                ...base,
                color: "#000000",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#4B5563",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-8">
          Loading users...
        </div>
      ) : selectedCompanyId && users.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No users found for this company
        </div>
      ) : selectedCompanyId ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-[#548B51] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>{user.answered_count} / {user.total_questions} questions</span>
                      {user.total_questions > 0 && (
                        <span className="text-gray-500">
                          ({user.completion_percentage !== undefined 
                            ? user.completion_percentage 
                            : Math.round((user.answered_count / user.total_questions) * 100 * 10) / 10}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteUser(user.user_id, user.name)}
                      disabled={deletingUserId === user.user_id}
                      className="px-4 py-1 rounded text-white cursor-pointer disabled:opacity-50"
                      style={{
                        backgroundColor:
                          deletingUserId === user.user_id ? "#F19999" : "#C40000",
                      }}
                    >
                      {deletingUserId === user.user_id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          Please select a company to view users
        </div>
      )}
    </div>
  );
};

export default UserManagement;

