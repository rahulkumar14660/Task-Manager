const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-700/40 rounded-xl ${className}`} />
);

export default Skeleton;