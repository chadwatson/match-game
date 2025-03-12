export default function Progress({
  max,
  value,
  showPercentage,
}: {
  max: number;
  value: number;
  className?: string;
  showPercentage?: boolean;
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="relative w-full h-2 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
        <div
          className="absolute top-0 left-0 h-full w-full bg-violet-600 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(${-100 + percentage}%)` }}
        />
      </div>
      {!!showPercentage && (
        <div className="ml-2 w-10 text-sm leading-1">{percentage}%</div>
      )}
    </div>
  );
}
