const PremiumBannerSkeleton = () => {
  return (
    <div className="bg-white rounded-full shadow-md xl:px-4 xl:py-3 flex items-center justify-between relative overflow-hidden p-2 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-gray-300">
          <div className="w-6 h-6" />
        </div>
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-5 w-40 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-300 rounded" />
        <div className="relative">
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBannerSkeleton;
