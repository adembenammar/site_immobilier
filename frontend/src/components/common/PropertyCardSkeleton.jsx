const PropertyCardSkeleton = () => (
  <div className="overflow-hidden rounded-[28px] bg-white shadow-soft dark:bg-slate-900">
    <div className="skeleton h-72 w-full" />
    <div className="space-y-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      <div className="flex gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-4 w-16 rounded-full" />
      </div>
      <div className="skeleton h-4 w-24 rounded-full" />
    </div>
  </div>
);

export const PropertyGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-8 lg:grid-cols-2 2xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
);

export default PropertyCardSkeleton;
