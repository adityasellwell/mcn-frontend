import { motion } from "framer-motion";

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
  ...props
}) => {
  const variants = {
    primary:
      "bg-[#0C831F] hover:bg-[#0A6F1A] text-white transition-all duration-300",

    secondary:
      "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300",
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
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
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;