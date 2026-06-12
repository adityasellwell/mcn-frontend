import { Mail, MapPin, Phone } from "lucide-react";

import Container from "../../components/ui/Container";

const Contact = () => {
  return (
    <section
      id="contact"
      className="
        py-8
        lg:py-8
      "
    >
      <Container>
        {/* Heading */}

        <div
          className="
            text-center
            max-w-3xl
            mx-auto
          "
        >
          <span
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-zinc-500
            "
          >
            CONTACT
          </span>

          <h2
            className="
              mt-6
              text-4xl
              lg:text-6xl
              font-bold
            "
          >
            Get In Touch
          </h2>

          <p
            className="
              mt-6
              text-zinc-400
              text-lg
            "
          >
            Have questions about MCN?
            We'd love to hear from you.
          </p>
        </div>

        {/* Content */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-10
            mt-12
          "
        >
          {/* Form */}

          <div
            className="
              p-8
              rounded-3xl

              border
              border-zinc-800

              bg-zinc-900
            "
          >
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="
                  w-full
                  px-4
                  py-3

                  rounded-xl

                  border
                  border-zinc-800

                  bg-zinc-950

                  outline-none

                  focus:border-[#0C831F]
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  px-4
                  py-3

                  rounded-xl

                  border
                  border-zinc-800

                  bg-zinc-950

                  outline-none

                  focus:border-[#0C831F]
                "
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="
                  w-full
                  px-4
                  py-3

                  rounded-xl

                  border
                  border-zinc-800

                  bg-zinc-950

                  outline-none

                  focus:border-[#0C831F]
                "
              />

              <textarea
                rows="5"
                placeholder="Message"
                className="
                  w-full
                  px-4
                  py-3

                  rounded-xl

                  border
                  border-zinc-800

                  bg-zinc-950

                  outline-none

                  focus:border-[#0C831F]
                "
              />

              <button
                type="submit"
                className="
                  w-full

                  py-3

                  rounded-xl

                  bg-[#0C831F]
                  hover:bg-[#0A6F1A]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5

                  font-medium
                "
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}

          <div
            className="
              p-8
              rounded-3xl

              border
              border-zinc-800

              bg-zinc-900

              space-y-8
            "
          >
            <div className="flex gap-4">
              <Mail
                className="
                  text-[#22C55E]
                "
              />

              <div>
                <h4 className="font-semibold">
                  Email
                </h4>

                <p className="text-zinc-500">
                  hello@mcn.com
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone
                className="
                  text-[#22C55E]
                "
              />

              <div>
                <h4 className="font-semibold">
                  Phone
                </h4>

                <p className="text-zinc-500">
                  +91 XXXXX XXXXX
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin
                className="
                  text-[#22C55E]
                "
              />

              <div>
                <h4 className="font-semibold">
                  Location
                </h4>

                <p className="text-zinc-500">
                  Mumbai, Maharashtra
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;