/**
 * Reusable Button Component
 *
 * Variants:
 * primary
 * secondary
 *
 * Usage:
 *
 * <Button>
 *   Join MCN
 * </Button>
 */

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary:
      "bg-[#0C831F] hover:bg-[#0A6F1A] text-white transition-all sduration-300 hover:-translate-y-0.5",

    secondary:
      "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-0.5",
  };

  return (
    <button
      type={type}
      className={`
        px-5
        py-2.5
        rounded-lg
        font-medium
        transition-all
        duration-200
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;