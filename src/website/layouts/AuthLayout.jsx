import { Outlet } from "react-router-dom";

import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const AuthLayout = () => {
  return (
    <div
      className="
        min-h-screen
        bg-zinc-950
        text-white
        flex
        flex-col
      "
    >
      <Header />

      <main
        className="
          flex-1

          flex
          items-center
          justify-center

          px-4
          py-10
        "
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;