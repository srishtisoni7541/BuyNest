const FormContainer = ({ title, children }) => (
  <div className="max-w-2xl">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  </div>
);
export default FormContainer;