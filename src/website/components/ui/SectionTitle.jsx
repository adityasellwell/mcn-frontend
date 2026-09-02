/**
 * Section Title Component
 *
 * Standard heading block
 * used throughout landing page.
 */

const SectionTitle = ({
  title,
  subtitle,
  center = false,
}) => {
  return (
    <div
      className={`mb-12 ${
        center ? "text-center" : ""
      }`}
    >
      <h2
        className="
          text-3xl
          md:text-4xl
          font-bold
          text-zinc-900
          dark:text-white
        "
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="
            mt-4
            text-zinc-600
            dark:text-zinc-400
            max-w-2xl
          "
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;