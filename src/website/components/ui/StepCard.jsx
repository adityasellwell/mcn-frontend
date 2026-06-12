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
    <div
      className="
        relative
        p-8

        rounded-3xl

        border
        border-zinc-800

        bg-zinc-900

        transition-all
        duration-300

        hover:border-[#0C831F]
        hover:-translate-y-1
      "
    >
      {/* Step Number */}

      <span
        className="
          text-5xl
          font-bold
          text-zinc-700
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
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-3
          text-zinc-400
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
};

export default StepCard;