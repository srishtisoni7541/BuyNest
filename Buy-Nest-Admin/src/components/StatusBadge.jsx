const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    status === 'Active' || status === 'Delivered' ? 'bg-green-100 text-green-800' :
    status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
    status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
    'bg-red-100 text-red-800'
  }`}>
    {status}
  </span>
);

export default StatusBadge;