import {Link} from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
 

const Login = () => {

  usePageTitle("Login - MCN");
  
  return (
      <div
      className="
        w-full
        max-w-md

        p-8

        rounded-3xl

        border
        border-zinc-800

        bg-zinc-900
      "
    >
      <h1
        className="
          text-3xl
          font-bold
          text-center
          text-white
        "
      >
        Welcome Back
      </h1>

      <p
        className="
          mt-3
          text-center
          text-zinc-500
        "
      >
        Login to your MCN account
      </p>

      <form className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Email or Mobile Number"
          className="
            w-full
            px-4
            py-3

            rounded-xl

            bg-zinc-950

            border
            border-zinc-800

            focus:border-[#0C831F]
            outline-none
          "
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full
            px-4
            py-3

            rounded-xl

            bg-zinc-950

            border
            border-zinc-800

            focus:border-[#0C831F]
            outline-none
          "
        />

        <button
          className="
            w-full

            py-3

            rounded-xl

            bg-[#0C831F]
            hover:bg-[#0A6F1A]

            transition-all
            duration-300
          "
        >
          Login
        </button>
        <div
            className="
              mt-6
              text-center
              text-sm
              text-zinc-500
            "
          >
            Don't have an account?{" "}

            <Link
              to="/register"
              className="
                text-[#22C55E]
                hover:underline
              "
            >
              Become A Member
            </Link>
          </div>
      </form>

    </div>
  );
};

export default Login;