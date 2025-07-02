'use client';
import { DollarSign } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SplitEase</span>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
            Simplifying shared expenses, one split at a time.
          </p>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 SplitEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
