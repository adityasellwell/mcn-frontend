const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorMap = {
    blue:   { bg: "bg-blue-500/10",   icon: "text-blue-400",   border: "border-blue-500/20" },
    green:  { bg: "bg-emerald-500/10", icon: "text-emerald-400", border: "border-emerald-500/20" },
    yellow: { bg: "bg-amber-500/10",  icon: "text-amber-400",  border: "border-amber-500/20" },
    red:    { bg: "bg-rose-500/10",   icon: "text-rose-400",   border: "border-rose-500/20" },
    purple: { bg: "bg-violet-500/10", icon: "text-violet-400", border: "border-violet-500/20" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-[#0f1b3d] border border-white/5 rounded-xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors">
      <div className={`h-11 w-11 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div>
        <p className="text-xs text-[#6b7ea3] uppercase tracking-wider font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value ?? "—"}</p>
      </div>
    </div>
  );
};

export default StatCard;