export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="flex-shrink-0 w-full md:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}