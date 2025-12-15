interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, action }) => {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold">
          PM
        </div>
        <h1 className="text-lg font-semibold text-gray-800">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {action}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
