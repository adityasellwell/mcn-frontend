import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";

const GetInvitedSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    city: "",
    preferredChapter: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      type: "VISITOR",
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      mobile: formData.phone,
      companyName: formData.businessName,
    });
    navigate(`/register?${queryParams.toString()}`);
  };

  return (
    <section
      id="get-invited"
      className="
        py-16
        bg-white
        dark:bg-zinc-950
      "
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="
            max-w-5xl
            mx-auto

            rounded-3xl

            border
            border-zinc-200
            dark:border-zinc-800

            bg-zinc-50
            dark:bg-zinc-900

            p-8
            lg:p-10
          "
        >
          {/* Heading */}

          <div className="text-center">
            <h2
              className="
                text-3xl
                lg:text-4xl

                font-bold
                text-zinc-900
                dark:text-white
              "
            >
              Attend A Meeting Before Joining
            </h2>

            <p
              className="
                mt-4

                text-zinc-600
                dark:text-zinc-400

                max-w-2xl
                mx-auto
              "
            >
              Experience an MCN networking meeting,
              connect with professionals, and explore
              new business opportunities before
              becoming a member.
            </p>
          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="
              mt-10

              grid
              md:grid-cols-2

              gap-5
            "
          >
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="
                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="
                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="
                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="
                md:col-span-2

                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="
                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <input
              type="text"
              name="preferredChapter"
              placeholder="Preferred Chapter"
              value={formData.preferredChapter}
              onChange={handleChange}
              required
              className="
                px-4
                py-3

                rounded-xl

                border
                border-zinc-200
                dark:border-zinc-700

                bg-white
                dark:bg-zinc-950
                text-zinc-900
                dark:text-white
                placeholder-zinc-400
                dark:placeholder-zinc-600

                focus:outline-none
                focus:border-[#0C831F]
                transition-colors
              "
            />

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="
                  w-full
                  py-3
                "
              >
                Request Invitation
              </Button>
            </div>
          </form>
        </motion.div>
      </Container>
    </section>
  );
};

export default GetInvitedSection;