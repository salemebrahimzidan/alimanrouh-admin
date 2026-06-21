import type { ReactNode } from 'react';

type DataTableProps = {
  children: ReactNode;
  minWidthClass?: string;
};

export function DataTable({
  children,
  minWidthClass = 'min-w-[640px]',
}: DataTableProps) {
  return (
    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <table className={`w-full ${minWidthClass}`}>{children}</table>
    </div>
  );
}
