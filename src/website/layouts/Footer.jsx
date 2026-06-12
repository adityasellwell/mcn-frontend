import Container from "../components/ui/Container";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="
        border-t
        border-zinc-800

        bg-zinc-950
      "
    >
      <Container>
        {/* Main Footer */}

        <div
          className="
            py-14

            grid
            md:grid-cols-3

            gap-10
          "
        >
          {/* Brand */}

          <div>
            <div
              className="
                flex
                items-center
                gap-3
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
                <h3
                  className="
                    text-xl
                    font-bold
                    text-white
                  "
                >
                  MCN
                </h3>

                <p
                  className="
                    text-xs
                    text-zinc-400
                  "
                >
                  Meet Connect Network
                </p>
              </div>
            </div>

            <p
              className="
                mt-5

                text-zinc-500
                leading-relaxed
                max-w-sm
              "
            >
              Building meaningful business
              relationships, referrals, and
              networking opportunities through
              a strong professional community.
            </p>
          </div>

          {/* Quick Links */}

          <div>
            <h4
              className="
                font-semibold
                text-white
                mb-5
              "
            >
              Quick Links
            </h4>

            <ul
              className="
                space-y-3
              "
            >
              <li>
                <a
                  href="/#about"
                  className="
                    text-zinc-500
                    hover:text-[#22C55E]
                    transition-colors
                  "
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="/#chapter"
                  className="
                    text-zinc-500
                    hover:text-[#22C55E]
                    transition-colors
                  "
                >
                  Chapter
                </a>
              </li>

              <li>
                <a
                  href="/#meetings"
                  className="
                    text-zinc-500
                    hover:text-[#22C55E]
                    transition-colors
                  "
                >
                  Meetings
                </a>
              </li>

              <li>
                <a
                  href="/#contact"
                  className="
                    text-zinc-500
                    hover:text-[#22C55E]
                    transition-colors
                  "
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h4
              className="
                font-semibold
                text-white
                mb-5
              "
            >
              Contact
            </h4>

            <div
              className="
                space-y-3
                text-zinc-500
              "
            >
              <p>
                hello@mcn.com
              </p>

              <p>
                +91 XXXXX XXXXX
              </p>

              <p>
                Mumbai, Maharashtra
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}

        <div
          className="
            border-t
            border-zinc-800

            py-5

            flex
            flex-col
            md:flex-row

            items-center
            justify-between

            gap-3
          "
        >
          <p
            className="
              text-sm
              text-zinc-600
            "
          >
            © 2026 MCN. All Rights Reserved.
          </p>

          <p
            className="
              text-sm
              text-zinc-600
            "
          >
            Built for Business Networking &
            Community Growth.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;