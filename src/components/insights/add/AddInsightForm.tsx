"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const AddInsightForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/data/insights`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add insight");
      }

      const addedInsight = await response.json();

      // Set success message
      setSuccessMessage("Insight added successfully!");
      setFormData({
        title: "",
        date: new Date().toISOString().split("T")[0],
        content: "",
      });

      // Redirect to the newly added insight after a short delay
      setTimeout(() => {
        router.push(`/insights/${addedInsight._id}`);
      }, 2000); // 2-second delay for user to see the success message
    } catch (error: any) {
      setError(error.message || "Failed to add insight. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Add New Insight
      </h1>

      {/* Success Message */}
      {successMessage && (
        <p className="text-green-600 bg-green-100 p-3 rounded-lg">
          {successMessage}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>
      )}

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter title"
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={handleContentChange}
          className="dark:bg-gray-700 dark:text-gray-200"
          style={{ height: "250px" }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Add Insight"}
        </button>
      </div>
    </form>
  );
};

export default AddInsightForm;
