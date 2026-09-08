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
      "
    >
      <div
        className="
          h-12
          w-12
          rounded-2xl
          bg-[#0C831F]/10
          dark:bg-emerald-500/15
          text-[#0C831F]
          dark:text-emerald-400
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
          text-xl
          font-bold
          mb-3
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
          text-sm
          lg:text-base
        "
      >
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;