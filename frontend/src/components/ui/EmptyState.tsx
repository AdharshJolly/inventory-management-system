import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Search size={48} className="text-gray-300 dark:text-gray-600" />,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="mb-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 animate-float">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
};

export default EmptyState;
