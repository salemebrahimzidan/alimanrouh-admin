import type { ReactNode } from 'react';

type DataTableProps = {
  children: ReactNode;
  minWidthClass?: string;
  maxHeightClass?: string;
};

export function DataTable({
  children,
  minWidthClass = 'min-w-[640px]',
  maxHeightClass = 'max-h-112',
}: DataTableProps) {
  return (
    <div
      className={`w-full max-w-full overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch] ${maxHeightClass}`}
    >
      <table
        className={`w-full ${minWidthClass} [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead_th]:bg-slate-950`}
      >
        {children}
      </table>
    </div>
  );
}
