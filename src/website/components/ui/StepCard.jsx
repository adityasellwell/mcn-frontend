import { motion } from "framer-motion";

/**
 * ==================================================
 * Step Card
 * ==================================================
 *
 * Reusable process card.
 *
 * Used In:
 * - How It Works
 *
 * ==================================================
 */

const StepCard = ({
  number,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="
        relative
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
      {/* Step Number */}

      <span
        className="
          text-5xl
          font-bold
          text-zinc-300
          dark:text-zinc-700
        "
      >
        {number}
      </span>

      {/* Title */}

      <h3
        className="
          mt-4
          text-2xl
          font-semibold
          text-zinc-900
          dark:text-white
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-3
          text-zinc-600
          dark:text-zinc-400
          leading-relaxed
        "
      >
        {description}
      </p>
    </motion.div>
  );
};

export default StepCard;