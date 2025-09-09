import Sidebar from "./Sidebar";


const Layout = ({ children, onSelect }) => {
  return (
    <div className="flex">
      <Sidebar onSelect={onSelect} />
      <div className="flex-1">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
