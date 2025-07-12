
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
import { DollarSign, ArrowLeft, Shield, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import toast from "react-hot-toast";
import { CustomAxiosError } from "../forgot-password/page";

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || sessionStorage.getItem("otpEmail") || "";
  const resetPassword = useResetPassword();

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (passwordError && value) {
      const error = validatePassword(value);
      setPasswordError(error);
    }
    
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPasswordError) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (password && value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const otp = sessionStorage.getItem("otpCode");
    e.preventDefault();
  
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
  
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
  
    setIsLoading(true);
    setPasswordError("");
    setConfirmPasswordError("");

    if (!email || !otp) {
      toast.error("Missing OTP or Email. Please restart the reset process.");
      return;
    }
  
    resetPassword.mutate(
      {
        email,
        otp, 
        newPassword: password,
      },
      {
        onSuccess: () => {
          setIsPasswordReset(true);
        },
        onError: (err: CustomAxiosError) => {
          console.log("The error is:", err);
    
          const message =
            err.response?.data?.message || err.message || "Something went wrong";
    
          console.log('"Failed to reset password. Please try again":', message);
          toast.error(message);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleBackToLogin = () => {
    router.push('/');
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

        {/* Reset Password Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
          <CardHeader className="text-center pb-6 lg:pb-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {isPasswordReset ? (
                <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              ) : (
                <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {isPasswordReset ? "Password Reset Successfully!" : "Set New Password"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base lg:text-lg leading-relaxed transition-colors duration-300">
              {isPasswordReset ? (
                "Your password has been successfully reset. You can now sign in with your new password."
              ) : (
                "Create a strong password for your account. Make sure it's unique and secure."
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 lg:space-y-8 lg:px-8">
            {!isPasswordReset ? (
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* New Password Input */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="password" 
                    className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={handlePasswordChange}
                      className={`h-12 lg:h-14 text-base lg:text-lg bg-white dark:bg-gray-700 border-2 pr-12 transition-all duration-300 ${
                        passwordError 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" />
                      ) : (
                        <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <div className="flex items-center space-x-2 text-red-500 text-sm lg:text-base">
                      <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="confirmPassword" 
                    className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`h-12 lg:h-14 text-base lg:text-lg bg-white dark:bg-gray-700 border-2 pr-12 transition-all duration-300 ${
                        confirmPasswordError 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" />
                      ) : (
                        <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <div className="flex items-center space-x-2 text-red-500 text-sm lg:text-base">
                      <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>{confirmPasswordError}</span>
                    </div>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 lg:p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm lg:text-base text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Password Requirements:</p>
                      <ul className="list-disc list-inside text-xs lg:text-sm space-y-1">
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Reset Password Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full cursor-pointer py-3 lg:py-4 text-lg lg:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Resetting Password...
                    </div>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6 lg:space-y-8">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 lg:p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm lg:text-base text-green-800 dark:text-green-200">
                      <p className="font-medium mb-1">Success!</p>
                      <p>Your password has been reset successfully. You can now use your new password to sign in to your account.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Login Button */}
            <Button
              variant="outline"
              onClick={handleBackToLogin}
              className="w-full cursor-pointer py-3 lg:py-4 text-base lg:text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              {isPasswordReset ? "Back to Login" : "Cancel"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
