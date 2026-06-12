import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component for public pages
 *
 * Props:
 * - children: React node
 * - centerContent: boolean (default false)
 *      If true, centers content vertically and horizontally (for forms like login/register)
 */
const Layout = ({ children, centerContent = false }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />

      <main
        className={`flex-1 px-4 py-10 ${
          centerContent ? "flex justify-center items-center" : ""
        }`}
      >
        <div className={centerContent ? "w-full max-w-md" : "w-full"}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;