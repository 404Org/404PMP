import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />

            {/* Main Content Area */}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-8 max-w-md">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <FileQuestion className="h-32 w-32 text-blue-500 animate-pulse" />
                    </div>

                    {/* Error Message */}
                    <div className="space-y-3">
                        <h1 className="text-8xl font-bold text-gray-900">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
                        <p className="text-gray-600 text-lg">
                            Oops! The page you are looking for might have been removed or doesn't exist.
                        </p>
                    </div>

                    {/* Back Button */}
                    <div className="pt-4">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <ArrowLeft className="h-10 w-10" />
                            <span>Go Back</span>
                        </button>
                    </div>

                    {/* Help Text */}
                    <p className="text-sm text-gray-500">
                        If you think this is a mistake, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
