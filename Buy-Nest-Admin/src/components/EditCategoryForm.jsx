
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditForm = ({ initialData, fields, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({}); // For files

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFileData({ ...fileData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData if any file exists
    let dataToSend;
    if (Object.keys(fileData).length > 0) {
      dataToSend = new FormData();
      // Append normal fields
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      // Append files
      for (const key in fileData) {
        Array.from(fileData[key]).forEach((file) => {
          dataToSend.append(key, file);
        });
      }
    } else {
      dataToSend = formData;
    }

    try {
      const response = await onSubmit(dataToSend);
      toast.success(response?.message || "Updated successfully ✅");
      onClose();
    } catch (err) {
      toast.error(err?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Edit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            if (field.type === "textarea") {
              return (
                <textarea
                  key={field.name}
                  name={field.name}
                  rows={field.rows || 4}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border rounded"
                />
              );
            } else if (field.type === "select") {
              return (
                <select
                  key={field.name}
                  name={field.name}
                  value={formData[field.name] || field.options[0]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              );
            } else if (field.type === "file") {
              return (
                <input
                  key={field.name}
                  type="file"
                  name={field.name}
                  onChange={handleChange}
                  multiple={field.multiple || false}
                  className="w-full px-4 py-2 border rounded"
                />
              );
            } else {
              return (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border rounded"
                />
              );
            }
          })}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
