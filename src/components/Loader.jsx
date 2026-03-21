import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
};

export default Loader;
