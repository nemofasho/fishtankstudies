import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTank } from "../services/tankService";

function CreateTank() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    className: ""
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);

    if (
      !formData.name.trim() ||
      !formData.subject.trim() ||
      !formData.className.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);

      const newTank = await createTank(formData);

      console.log("Tank created:", newTank);

      navigate("/dashboard");
    } catch (err) {
      console.error("Create Tank error:", err);
      setError(err.message || "Unable to create Tank.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-tank-page">

      <div className="create-tank-container">

        <h1>Create Tank</h1>

        <p>
          Create a study Tank for your class or study group.
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form
          className="create-tank-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="name">
              Tank Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Database Study Group"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">
              Subject
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Computer Science"
            />
          </div>

          <div className="form-group">
            <label htmlFor="className">
              Class
            </label>

            <input
              id="className"
              name="className"
              type="text"
              value={formData.className}
              onChange={handleChange}
              placeholder="CSC 471"
            />
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tank"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default CreateTank;