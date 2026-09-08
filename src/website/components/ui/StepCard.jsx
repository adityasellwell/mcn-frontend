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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="
        relative
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
      "
    >
      {/* Step Number */}

      <span
        className="
          text-5xl
          font-extrabold
          text-[#0C831F]/20
          dark:text-zinc-700
        "
      >
        {number}
      </span>

      {/* Title */}

      <h3
        className="
          mt-3
          text-xl
          font-bold
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
          text-sm
          lg:text-base
        "
      >
        {description}
      </p>
    </motion.div>
  );
};

export default StepCard;