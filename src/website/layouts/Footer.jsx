import Container from "../components/ui/Container";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="
        border-t
        border-zinc-200
        dark:border-zinc-800

        bg-zinc-50
        dark:bg-zinc-950
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
                    text-zinc-900
                    dark:text-white
                  "
                >
                  MCN
                </h3>

                <p
                  className="
                    text-xs
                    text-zinc-600
                    dark:text-zinc-400
                  "
                >
                  Muslim Community Network
                </p>
              </div>
            </div>

            <p
              className="
                mt-5

                text-zinc-500
                dark:text-zinc-500
                leading-relaxed
                max-w-sm
              "
            >
              Building meaningful community
              relationships, connections, and
              opportunities through a strong
              professional network.
            </p>
          </div>

          {/* Quick Links */}

          <div>
            <h4
              className="
                font-semibold
                text-zinc-900
                dark:text-white
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
                    text-zinc-600
                    dark:text-zinc-500
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
                    text-zinc-600
                    dark:text-zinc-500
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
                    text-zinc-600
                    dark:text-zinc-500
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
                    text-zinc-600
                    dark:text-zinc-500
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
                text-zinc-900
                dark:text-white
                mb-5
              "
            >
              Contact
            </h4>

            <div
              className="
                space-y-3
                text-zinc-600
                dark:text-zinc-500
              "
            >
              <p>
                <a
                  href="mailto:support@mcnmumbai.com"
                  className="hover:text-[#22C55E] transition-colors"
                >
                  support@mcnmumbai.com
                </a>
              </p>

              <p>
                <a
                  href="tel:+918444040514"
                  className="hover:text-[#22C55E] transition-colors"
                >
                  +91 84440 40514
                </a>
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
            border-zinc-200
            dark:border-zinc-800

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
              text-zinc-500
              dark:text-zinc-600
            "
          >
            © 2026 MCN — Muslim Community Network. All Rights Reserved.
          </p>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-600
            "
          >
            Built &amp; maintained by{" "}
            <a
              href="https://inspiringinfosys.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22C55E] hover:underline"
            >
              Inspiring Infosys
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;