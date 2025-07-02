"use client";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth/useLogin";
import withGuest from "@/lib/auth/withGuest";
import { loginSchema } from "@/lib/utils/validation";
import {
  DollarSign,
  Users,
  Calculator,
  ArrowRight,
  Star,
  Shield,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const login = useLogin();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = loginSchema.validate(formData, { abortEarly: false });

    if (error) {
      const messages = error.details.map((err) => err.message).join("\n");
      toast.error(messages);
      return;
    }

    login.mutate(formData, {
      onError: () => {
        toast.error("Invalid email or password");
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Login Form */}
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-lg space-y-8">
            {/* Logo and Header */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    SplitEase
                  </span>
                </Link>
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </Button>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight transition-colors duration-300">
                Welcome back
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
                Sign in to your account and continue managing your shared
                expenses with ease
              </p>
            </div>

            {/* Login Card */}
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm dark:shadow-gray-900/50 transition-colors duration-300">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl text-center lg:text-left text-gray-900 dark:text-white transition-colors duration-300">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center lg:text-left text-base text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12 text-base border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 text-base border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300"
                      >
                        Remember me
                      </Label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base font-medium shadow-lg transition-all duration-200"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 text-base border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Don&#39;t have an account?{" "}
                  </span>
                  <a
                    href="/register"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    Create one now
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Features showcase */}
        <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-900 relative overflow-hidden transition-colors duration-300">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 dark:bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 dark:bg-white/10 rounded-full translate-y-40 -translate-x-40"></div>

          <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full">
            <div className="max-w-lg">
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Split Smart, Settle Easy
                </h2>
                <p className="text-xl text-blue-100 dark:text-blue-200 leading-relaxed transition-colors duration-300">
                  Join over 50,000 users who trust SplitEase to manage their
                  shared expenses effortlessly.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-white/20 dark:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Calculator className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Smart Calculations
                    </h3>
                    <p className="text-blue-100 dark:text-blue-200 leading-relaxed transition-colors duration-300">
                      Automatically split bills with tax, tip, and custom
                      percentages. No more manual math.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-white/20 dark:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Group Management
                    </h3>
                    <p className="text-blue-100 dark:text-blue-200 leading-relaxed transition-colors duration-300">
                      Create groups for trips, roommates, or events. Track who
                      owes what in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-white/20 dark:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Secure & Private
                    </h3>
                    <p className="text-blue-100 dark:text-blue-200 leading-relaxed transition-colors duration-300">
                      Bank-level security with end-to-end encryption. Your
                      financial data stays private.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-2xl transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold">$2.5M+</div>
                    <p className="text-blue-100 dark:text-blue-200 transition-colors duration-300">
                      Expenses managed
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-blue-100 dark:text-blue-200 text-sm transition-colors duration-300">
                  &quot;SplitEase has completely transformed how our group
                  handles shared expenses. Highly recommended!&quot;
                </p>
                <p className="text-white font-medium mt-2">
                  - Sarah M., Product Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGuest(Login);;
