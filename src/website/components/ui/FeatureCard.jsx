import {
  Users,
  Handshake,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  users: Users,
  handshake: Handshake,
  calendar: CalendarDays,
  growth: TrendingUp,
};

const FeatureCard = ({
  icon,
  title,
  description,
}) => {
  const Icon = iconMap[icon];

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
      <div
        className="
          h-12
          w-12

          rounded-xl

          bg-zinc-200
          dark:bg-zinc-800
          text-[#0C831F]

          flex
          items-center
          justify-center

          mb-6
        "
      >
        <Icon size={22} />
      </div>

      <h3
        className="
          text-2xl
          font-semibold
          mb-4
          text-zinc-900
          dark:text-white
        "
      >
        {title}
      </h3>

      <p
        className="
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

export default FeatureCard;