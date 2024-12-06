import React from 'react';
import { Clock } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <Clock className="mx-auto text-blue-500 mb-4" size={48} />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
        <a
          href="/home"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ComingSoon; 