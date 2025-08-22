import { useState, useEffect } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../App.css"; // ✅ reuse theme

function CompleteProfilePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    age: "",
    certifications: "",
    dateOfBirth: "",
    department: "",
    education: "",
    email: "",
    emergencyContact: "",
    employeeId: "",
    employmentType: "",
    exactRole: "",
    experience: "",
    gender: "",
    joiningDate: "",
    nationality: "",
    phoneNumber: "",
    skills: "",
  });

  // Fetch logged-in user's name
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      authService.getCurrentUser().then((res) => {
        setUserName(res?.name || "");
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        return;
      }
      await authService.updateProfile(
        { ...formData, profileCompleted: true },
        token
      );
      navigate(-1);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  // ✅ Field labels
  const fieldLabels = {
    address: "Address",
    age: "Age",
    certifications: "Certifications",
    dateOfBirth: "Date of Birth",
    department: "Department",
    education: "Education",
    email: "Email",
    emergencyContact: "Emergency Contact",
    employeeId: "Employee ID",
    employmentType: "Employment Type",
    exactRole: "Exact Role",
    experience: "Experience",
    gender: "Gender",
    joiningDate: "Joining Date",
    nationality: "Nationality",
    phoneNumber: "Phone Number",
    skills: "Skills",
  };

  return (
    <div className="auth-container-cp">
      {/* Greeting */}
      <h2 className="form-title">Hello, {userName || "there"}! Complete Your Profile</h2>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="profile-form"
      >
        <div className="form-grid">
          {Object.keys(formData).map((field) => {
            if (field === "employmentType") {
              return (
                <div key={field} className="form-group">
                  <label>{fieldLabels[field]}</label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              );
            }

            if (field === "gender") {
              return (
                <div key={field} className="form-group">
                  <label>{fieldLabels[field]}</label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              );
            }

            if (field === "department") {
              return (
                <div key={field} className="form-group">
                  <label>{fieldLabels[field]}</label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Department</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              );
            }

            if (field === "dateOfBirth" || field === "joiningDate") {
              return (
                <div key={field} className="form-group">
                  <label>{fieldLabels[field]}</label>
                  <input
                    type="date"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              );
            }

            return (
              <div key={field} className="form-group">
                <label>{fieldLabels[field]}</label>
                <input
                  name={field}
                  placeholder={fieldLabels[field]}
                  value={formData[field]}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="form-submit">
          <button type="submit" className="primary-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompleteProfilePage;
