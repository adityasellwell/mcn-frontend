import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import api from "../../../services/api";
import toast from "react-hot-toast";

const Contact = () => {
  const [contact, setContact] = useState({ email: null, phone: null });
  const [fullName, setFullName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/admin/contact")
      .then((res) => setContact(res.data?.data || {}))
      .catch(() => {});
  }, []);

  const email = contact.email || "mcnmumbai@gmail.com";
  const phone = contact.phone ? `+91 ${contact.phone}` : "+91 90000 00000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !emailInput.trim() || !phoneInput.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/contact", {
        fullName: fullName.trim(),
        email: emailInput.trim(),
        phone: phoneInput.trim(),
        message: message.trim(),
      });
      toast.success("Your message has been sent successfully!");
      setFullName("");
      setEmailInput("");
      setPhoneInput("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="
        py-12
        lg:py-16
        bg-white
        dark:bg-zinc-950
      "
    >
      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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
              dark:text-zinc-500
              font-medium
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
              text-zinc-900
              dark:text-white
            "
          >
            Get In Touch
          </h2>

          <p
            className="
              mt-6
              text-zinc-600
              dark:text-zinc-400
              text-lg
            "
          >
            Have questions about MCN?
            We'd love to hear from you.
          </p>
        </motion.div>

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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="
              p-8
              rounded-3xl
              border
              border-zinc-200
              dark:border-zinc-800
              bg-zinc-50
              dark:bg-zinc-900
            "
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                required
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  bg-white
                  dark:bg-zinc-950
                  text-zinc-900
                  dark:text-white
                  placeholder-zinc-400
                  dark:placeholder-zinc-600
                  outline-none
                  focus:border-[#0C831F]
                  transition-colors
                "
              />

              <input
                required
                type="email"
                placeholder="Email Address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  bg-white
                  dark:bg-zinc-950
                  text-zinc-900
                  dark:text-white
                  placeholder-zinc-400
                  dark:placeholder-zinc-600
                  outline-none
                  focus:border-[#0C831F]
                  transition-colors
                "
              />

              <input
                required
                type="text"
                placeholder="Phone Number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  bg-white
                  dark:bg-zinc-950
                  text-zinc-900
                  dark:text-white
                  placeholder-zinc-400
                  dark:placeholder-zinc-600
                  outline-none
                  focus:border-[#0C831F]
                  transition-colors
                "
              />

              <textarea
                required
                rows="5"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  bg-white
                  dark:bg-zinc-950
                  text-zinc-900
                  dark:text-white
                  placeholder-zinc-400
                  dark:placeholder-zinc-600
                  outline-none
                  focus:border-[#0C831F]
                  transition-colors
                "
              />

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full
                  py-3
                  rounded-xl
                  bg-[#0C831F]
                  hover:bg-[#0A6F1A]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  font-medium
                  transition-colors
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="
              p-8
              rounded-3xl
              border
              border-zinc-200
              dark:border-zinc-800
              bg-zinc-50
              dark:bg-zinc-900
              space-y-8
            "
          >
            <div className="flex gap-4">
              <Mail className="text-[#0C831F] shrink-0 mt-0.5" />

              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">Email</h4>
                <a
                  href={`mailto:${email}`}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-[#22C55E] transition-colors break-all"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-[#0C831F] shrink-0 mt-0.5" />

              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">Phone</h4>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-[#22C55E] transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="text-[#0C831F] shrink-0 mt-0.5" />

              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">Location</h4>
                <p className="text-zinc-600 dark:text-zinc-400">Mumbai, Maharashtra</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;