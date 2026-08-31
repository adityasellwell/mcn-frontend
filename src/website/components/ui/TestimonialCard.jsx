import { motion } from "framer-motion";

const TestimonialCard = ({
  testimonial,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="
        p-8

        rounded-3xl

        border
        border-zinc-200
        dark:border-zinc-800

        bg-zinc-50
        dark:bg-zinc-900

        transition-all
        duration-300

        hover:border-[#0C831F]
        dark:hover:border-[#0C831F]
        hover:shadow-xl
        hover:shadow-black/5
        dark:hover:shadow-black/20
      "
    >
      <p
        className="
          text-zinc-700
          dark:text-zinc-300
          leading-relaxed
          italic
        "
      >
        "{testimonial.testimonial}"
      </p>

      <div className="mt-6">
        <h4
          className="
            font-semibold
            text-zinc-900
            dark:text-white
          "
        >
          {testimonial.name}
        </h4>

        <p
          className="
            text-sm
            text-zinc-500
            dark:text-zinc-500
          "
        >
          {testimonial.company}
        </p>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;