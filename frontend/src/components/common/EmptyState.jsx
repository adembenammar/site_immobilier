const EmptyState = ({ title, description }) => (
  <div className="rounded-[28px] border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
    <h3 className="font-display text-2xl">{title}</h3>
    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);

export default EmptyState;
