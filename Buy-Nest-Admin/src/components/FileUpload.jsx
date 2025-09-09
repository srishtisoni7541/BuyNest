import { useRef } from "react";

const FileUpload = ({ label, onFilesSelected }) => {
  const inputRef = useRef();

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    onFilesSelected(files); 
  };

  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        multiple 
      />
    </div>
  );
};


export default FileUpload;
