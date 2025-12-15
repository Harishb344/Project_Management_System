import Header from "../components/Header";
interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  action,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header title={title} action={action} />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};
export default AppLayout
