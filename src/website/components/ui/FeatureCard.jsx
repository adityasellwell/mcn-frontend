import {
  Users,
  Handshake,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

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
    <div
      className="
        p-8
        rounded-3xl

        border
        border-zinc-800

        bg-zinc-900

        transition-all
        duration-300

        hover:border-[#0C831F]
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-black/20 s
      "
    >
      <div
        className="
          h-12
          w-12

          rounded-xl

          bg-zinc-800

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
        "
      >
        {title}
      </h3>

      <p
        className="
          text-zinc-400
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;