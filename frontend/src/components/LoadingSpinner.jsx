import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-12">
      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
      {message && <p className="text-gray-500 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
