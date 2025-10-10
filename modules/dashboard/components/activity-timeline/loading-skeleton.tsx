import styles from './loading-skeleton.module.css';

export default function ActivityTimelineLoadingSkeleton() {
  const skeletonItems = Array.from({ length: 4 }, (_, index) => (
    <div 
      key={index} 
      className={`flex gap-4 ${styles['animate-fadeIn']}`} 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-sm ${styles['pulse-soft']}`}></div>
        {index < 4 && <div className="w-px bg-gradient-to-b from-gray-200 to-gray-100 h-20 mt-1"></div>}
      </div>
      <div className="flex-grow space-y-3 pb-6">
        <div className="flex justify-between items-start gap-4">
          <div className={`h-4 rounded-md ${styles['skeleton-item']} ${styles.shimmer} ${
            index % 3 === 0 ? 'w-48' : index % 3 === 1 ? 'w-56' : 'w-40'
          }`}></div>
          <div className={`h-3 rounded-md w-20 ${styles['skeleton-item']} ${styles.shimmer}`}></div>
        </div>
        <div className={`h-3 rounded-md ${styles['skeleton-item']} ${styles.shimmer} ${
          index % 4 === 0 ? 'w-full' : index % 4 === 1 ? 'w-4/5' : index % 4 === 2 ? 'w-3/4' : 'w-2/3'
        }`}></div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <div className={`w-5 h-5 rounded ${styles['skeleton-item']} ${styles.shimmer}`}></div>
          <div className={`h-3 rounded-md ${styles['skeleton-item']} ${styles.shimmer} ${
            index % 3 === 0 ? 'w-24' : index % 3 === 1 ? 'w-32' : 'w-28'
          }`}></div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="space-y-0 relative">
      <div className="mt-6">
        {skeletonItems}
      </div>
    </div>
  );
}
