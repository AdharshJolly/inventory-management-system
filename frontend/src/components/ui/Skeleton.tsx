import React from "react";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return <div className={`shimmer rounded-xl ${className}`} />;
};

export default Skeleton;
