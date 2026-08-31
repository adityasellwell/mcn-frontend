import usePageTitle from "../../hooks/usePageTitle";

const ComingSoon = ({ title, description }) => {
  usePageTitle(`${title} - MCN Portal`);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
        <p className="text-zinc-500">This section is coming soon.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
