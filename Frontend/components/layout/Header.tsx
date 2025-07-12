'use client';
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useLogout } from "@/hooks/auth/useLogout";

import { Button } from "@/components/ui/button";
import {
  DollarSign,
  User,
  Settings,
  LogOut,
  CreditCard,
  PieChart,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { RootState } from "@/redux/store/store";
import Image from "next/image";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useLogout();
  const user = useSelector((state: RootState) => state.user);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout.mutate();
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              SplitEase
            </h1>
          </div>

          {/* Right-side Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </Button>

            <span className="text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
              Welcome back, {user.name || "User"}!
            </span>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="cursor-pointer w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="cursor-pointer w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">View Profile</span>
                    </button>

                    <button className="cursor-pointer w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Payment Methods</span>
                    </button>

                    <button className="cursor-pointer w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <PieChart className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Expense Analytics</span>
                    </button>

                    <button className="cursor-pointer w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <Bell className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                    </button>

                    <button className="cursor-pointer w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
