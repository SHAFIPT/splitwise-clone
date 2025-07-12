const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-md"></div>
    </div>
  );
};

export default Spinner;
