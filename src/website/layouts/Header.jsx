import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      label: "Home",
      href: "/#hero",
    },
    {
      label: "About",
      href: "/#about",
    },
    {
      label: "Chapter",
      href: "/#chapter",
    },
    {
      label: "Meetings",
      href: "/#meetings",
    },
    {
      label: "Contact",
      href: "/#contact",
    },
    
  ];

  return (
    <header
      className="
        sticky
        top-0
        z-50

        border-b
        border-zinc-800

        bg-zinc-950/80

        backdrop-blur-md
      "
    >
      <Container>
        <div
          className="
            flex
            items-center
            justify-between

            h-20
          "
        >
          {/* Logo */}

          <Link
            to="/"
            className="
              flex
              items-center
              gap-3

              shrink-0
            "
          >
            <div
              className="
                h-10
                w-10

                rounded-xl

                bg-[#0C831F]

                flex
                items-center
                justify-center

                font-bold
                text-white
              "
            >
              M
            </div>

            <div>
              <h1
                className="
                  text-lg
                  font-bold
                  text-white
                  whitespace-nowrap
                "
              >
                MCN
              </h1>

              <p
                className="
                  hidden
                  sm:block

                  text-xs
                  text-zinc-400
                  whitespace-nowrap
                "
              >
                Meet Connect Network
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav
            className="
              hidden
              md:flex

              items-center
              gap-8
            "
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  relative

                  text-zinc-400

                  hover:text-[#22C55E]

                  transition-all
                  duration-300

                  after:absolute
                  after:left-0
                  after:-bottom-1

                  after:h-[2px]
                  after:w-0

                  after:bg-[#0C831F]

                  after:transition-all
                  after:duration-300

                  hover:after:w-full
                "
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}

          <div
            className="
              hidden
              md:flex

              items-center
              gap-3
            "
          >
            <Link to="/login">
              <Button variant="secondary">
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="secondary">
                Register Yourself
              </Button>
            </Link>

            <a href="/#get-invited">
              <Button>
                Get Invited
              </Button>
            </a>
          </div>

          {/* Mobile Toggle */}

          <button
            className="md:hidden"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}

        {mobileOpen && (
          <div
            className="
              md:hidden

              py-5

              border-t
              border-zinc-800
            "
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="
                    text-zinc-300

                    hover:text-[#22C55E]
                  "
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  {link.label}
                </a>
              ))}

              <div
                className="
                  pt-4

                  flex
                  flex-col
                  gap-3
                "
              >
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                     Register Yourself
                  </Button>
                </Link>

                 <a href="/#get-invited">
              <Button
               onClick={() =>
                    setMobileOpen(false)}>
                Get Invited
              </Button>
            </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;