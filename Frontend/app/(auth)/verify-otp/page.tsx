"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { useRegister } from "@/hooks/auth/useRegister";
import { useSendOtp } from "@/hooks/auth/useSendOtp";
import { useVerifyOtp } from "@/hooks/auth/useVerifyOtp";
import withGuest from "@/lib/auth/withGuest";
import { setAccessToken } from "@/lib/utils/tokenUtils";
import { setUser } from "@/redux/slices/userSlice";
import { DollarSign, ArrowLeft, Shield, Clock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

type OTPVerificationProps = {
  isDark?: boolean;
  onBack: () => void;
};

const OTPVerification = ({ isDark = false, onBack }: OTPVerificationProps) => {
  const verifyOtp = useVerifyOtp();
  const register = useRegister();
  const dispatch = useDispatch();
  const router = useRouter();
  const sendOtp = useSendOtp();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft] = useState<number>(120);
  const isVerifying = verifyOtp.isPending || register.isPending;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = () => {
    const otpFlow = sessionStorage.getItem("otpFlow");
    const email = sessionStorage.getItem("otpEmail");
    const stored = sessionStorage.getItem("registerData");
  
    if (!otpFlow || !email) {
      return alert("Invalid OTP session data");
    }
  
    verifyOtp.mutate(
      { email, otp: otp.join("") },
      {
        onSuccess: () => {
          toast.success("OTP Verified ✅");
  
          if (otpFlow === "register") {
            if (!stored) return toast("No registration data found");
            const { name, password } = JSON.parse(stored);
  
            register.mutate(
              { name, email, password },
              {
                onSuccess: (data) => {
                  setAccessToken(data.accessToken);
                  dispatch(
                    setUser({
                      id: data.user.id,
                      name: data.user.name,
                      email: data.user.email,
                    })
                  );
                  router.push("/dashboard");
                },
                onError: () => {
                  toast.error("Registration failed");
                },
              }
            );
          } else if (otpFlow === "forgot") {
            sessionStorage.setItem('otpCode', otp.join(""));
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
          }
        },
        onError: () => alert("Invalid OTP"),
      }
    );
  };

  const handleResendOtp = () => {
    const email = sessionStorage.getItem("otpEmail");
    const type = sessionStorage.getItem("otpFlow"); // "register" or "forgot"
  
    if (!email || !type) {
      toast.error("Missing session data. Please start over.");
      return;
    }
  
    sendOtp.mutate({ email, type });
  };
  

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                SplitEase
              </span>
            </div>
          </div>

          {/* OTP Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed transition-colors duration-300">
                We&apos;ve sent a 6-digit verification code to
                <br />
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  john@example.com
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-4">
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 outline-none"
                      placeholder="0"
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Clock className="w-4 h-4" />
                  <span>Code expires in {formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={otp.some((digit) => !digit) || isVerifying}
                className="w-full py-3 cursor-pointer text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Didn&rsquo;t receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Code
                </Button>
              </div>

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full cursor-pointer py-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              By verifying, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGuest(OTPVerification);
