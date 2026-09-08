import { motion } from "framer-motion";

const TestimonialCard = ({
  testimonial,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="
        p-8
        rounded-3xl
        border
        border-zinc-200/90
        dark:border-zinc-800
        bg-white
        dark:bg-zinc-900
        shadow-sm
        hover:shadow-xl
        hover:shadow-green-900/5
        dark:hover:shadow-black/30
        transition-all
        duration-300
        hover:border-[#0C831F]
        dark:hover:border-[#0C831F]
        relative
      "
    >
      <p
        className="
          text-zinc-700
          dark:text-zinc-300
          leading-relaxed
          italic
          text-sm
          lg:text-base
        "
      >
        "{testimonial.testimonial}"
      </p>

      <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#0C831F]/10 dark:bg-emerald-500/15 text-[#0C831F] dark:text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
          {testimonial.name?.charAt(0) || "M"}
        </div>
        <div>
          <h4
            className="
              font-bold
              text-zinc-900
              dark:text-white
              text-sm
            "
          >
            {testimonial.name}
          </h4>

          <p
            className="
              text-xs
              text-zinc-500
              dark:text-zinc-400
              mt-0.5
            "
          >
            {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;