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
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2 className="modal-title">Enter Your Details</h2>

        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="modal-input"
        />
        {errors.userName && (
          <p className="text-red-500 text-sm mb-2">{errors.userName}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="modal-input"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>
        )}

        <div className="modal-buttons">
          <button onClick={onClose} className="modal-btn-cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="modal-btn-submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
