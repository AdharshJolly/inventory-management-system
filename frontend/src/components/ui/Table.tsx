import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ headers, children, className = "" }) => {
  return (
    <div
      className={`w-full overflow-auto rounded-xl border border-gray-200/60 dark:border-gray-700/60 ${className}`}
    >
      <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
        <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200/60 dark:border-gray-700/60">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-3 sm:px-6 py-3.5 font-semibold whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 bg-white dark:bg-gray-800/50">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
