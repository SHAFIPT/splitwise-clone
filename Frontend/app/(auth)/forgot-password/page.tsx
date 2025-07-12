"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowLeft, Mail, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import toast from "react-hot-toast";

export interface CustomAxiosError extends Error {
    response?: {
      data?: {
        message?: string;
      };
      status?: number;
    };
    code?: string;
  }

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const forgotPassword = useForgotPassword();
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && validateEmail(value)) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email) {
      setEmailError("Email is required");
      return;
    }
  
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
  
    setEmailError("");
  
    try {
      await forgotPassword.mutateAsync(email);
      // On success, store data and redirect
      sessionStorage.setItem("otpFlow", "forgot");    
      sessionStorage.setItem("otpEmail", email);        
      router.push("/verify-otp");
    } catch (err: unknown) {
      const error = err as CustomAxiosError;
      const message =
        error.response?.data?.message || error.message || "Failed to send OTP. Please try again.";
      toast.error(message);
    }
  };
  
  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <span className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              SplitEase
            </span>
          </div>
        </div>

        {/* Forgot Password Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
          <CardHeader className="text-center pb-6 lg:pb-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base lg:text-lg leading-relaxed transition-colors duration-300">
              Enter your email address and we&apos;ll send you an OTP to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 lg:space-y-8 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {/* Email Input */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`h-12 lg:h-14 text-base lg:text-lg bg-white dark:bg-gray-700 border-2 transition-all duration-300 ${
                    emailError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                  }`}
                  disabled={forgotPassword.isPending}
                />
                {emailError && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm lg:text-base">
                    <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              {/* Send OTP Button */}
              <Button
                type="submit"
                disabled={forgotPassword.isPending || !email}
                className="w-full py-3 cursor-pointer lg:py-4 text-lg lg:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {forgotPassword.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending OTP...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>
            </form>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full cursor-pointer py-3 lg:py-4 text-base lg:text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Remember your password?{" "}
            <button
              onClick={handleBack}
              className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;