import type { ReactNode } from 'react';

export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-black/5">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-gray-400 whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-black/5 last:border-0 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 text-[13px] text-gray-700 align-middle ${className}`}>{children}</td>;
}
