const FormField = ({ 
  label, 
  type = "text", 
  placeholder, 
  rows, 
  options = [], 
  className = "",
  value,
  onChange,
  name
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

    {type === 'textarea' ? (
      <textarea
        name={name} 
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    ) : type === 'select' ? (
      <select
        name={name} 
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    ) : (
      <input
        name={name} 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    )}
  </div>
);

export default FormField;
