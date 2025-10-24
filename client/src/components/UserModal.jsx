import { useState } from "react";

export default function UserModal({ isOpen, onClose, onSubmit, initialUser }) {
  const [userName, setUserName] = useState(initialUser?.userName || "");
  const [fullName, setFullName] = useState(initialUser?.fullName || "");
  const [errors, setErrors] = useState({ userName: "", fullName: "" });

  if (!isOpen) return null;

  const validate = () => {
    let valid = true;
    const newErrors = { userName: "", fullName: "" };

    if (!userName.trim()) {
      newErrors.userName = "Username is required";
      valid = false;
    } else if (userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
      valid = false;
    }

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    } else if (fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ userName, fullName });
    setUserName("");
    setFullName("");
    setErrors({ userName: "", fullName: "" });
  };

  return (
    <div className="user-modal-backdrop">
      <div className="user-modal-container">
        <h2 className="user-modal-title">Enter Your Details</h2>

        <div className="user-modal-field">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="user-modal-input"
          />
          {errors.userName && (
            <p className="user-modal-error">{errors.userName}</p>
          )}
        </div>

        <div className="user-modal-field">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="user-modal-input"
          />
          {errors.fullName && (
            <p className="user-modal-error">{errors.fullName}</p>
          )}
        </div>

        <div className="user-modal-buttons">
          <button onClick={onClose} className="user-modal-btn-cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="user-modal-btn-submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
