/* Developed by Grafizen International PVT. LTD. */
'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Loader2, User, LogOut, ShoppingBag, UserCircle } from 'lucide-react'
import { Button } from './common/ui-product/button'
import { Input } from './common/ui-product/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './common/ui-product/dropdown-menu'
import Cow from "../../public/imges/loginModal/cow.png"
import honey from "../../public/imges/loginModal/honey.png"
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../public/imges/Logo-green-text.png"
import { ApiPost } from '@/helper/axios'

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [otpArray, setOtpArray] = useState(['', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [maskedMobile, setMaskedMobile] = useState('')
  const otpAbortControllerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setStep("mobile");
      setMobile("");
      setOtpArray(["", "", "", "", ""]);
      setLoading(false);
      setShowSuccess(false);
      setMaskedMobile("");

      otpAbortControllerRef.current?.abort();
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        document.getElementById("otp-hidden")?.focus();
      }, 300);
    }
  }, [step]);

  const fillOtpAndVerify = (code) => {
    const cleanCode = code.replace(/\D/g, "").slice(0, 5);

    if (cleanCode.length !== 5) return;

    setOtpArray([
      cleanCode[0],
      cleanCode[1],
      cleanCode[2],
      cleanCode[3],
      cleanCode[4],
    ]);

    setTimeout(() => {
      handleVerifyOtp(cleanCode);
    }, 100);
  };

  const startWebOtpListener = async () => {
    if (typeof window === "undefined") return;

    if (!("OTPCredential" in window)) {
      console.log("WebOTP not supported. Test only in Android Chrome.");
      return;
    }

    try {
      otpAbortControllerRef.current?.abort();

      const controller = new AbortController();
      otpAbortControllerRef.current = controller;

      const otp = await navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: controller.signal,
      });

      if (otp?.code) {
        fillOtpAndVerify(otp.code);
      }
    } catch (err) {
      console.log("WebOTP error:", err);
    }
  };

  const handleSendOtp = async () => {
    if (mobile.length !== 10) return;

    try {
      setLoading(true);

      startWebOtpListener();

      const res = await ApiPost("/auth/send-otp", {
        mobileNumber: mobile,
        countryCode: "+91",
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to send OTP");
      }

      setMaskedMobile(`+91 ${mobile.slice(0, 2)}******${mobile.slice(-2)}`);
      setStep("otp");

      setTimeout(() => {
        document.getElementById("otp-hidden")?.focus();
      }, 300);
    } catch (err) {
      console.log("OTP Error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (directOtp) => {
    const finalOtp = directOtp || otpArray.join("");

    if (finalOtp.length !== 5) return;

    try {
      setLoading(true);

      const res = await ApiPost("/auth/verify-otp", {
        mobileNumber: mobile,
        otp: finalOtp,
        countryCode: "+91",
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Invalid OTP");
      }

      if (res.data?.token) {
        localStorage.setItem("gawdee_token", res.data?.token);
      }

      const userData = res?.data?.user || {
        name: "User",
        phone: mobile,
      };

      localStorage.setItem("gawdee_user", JSON.stringify(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      localStorage.setItem(
        "userId",
        res.data?.userId || res.data?.user?._id || res.data?.user?.id || ""
      );

      localStorage.setItem("gawdee_logged_in", "true");
      localStorage.setItem("isLoggedIn", "true");

      otpAbortControllerRef.current?.abort();

      onClose?.();

      setTimeout(() => {
        onSuccess?.();
      }, 100);

    } catch (err) {
      console.log("Verify OTP Error:", err);
      alert(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep('mobile')
    setOtpArray(['', '', '', '', ''])
  }

  if (!isOpen) return null

  const finalOtp = otpArray.join('')

  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 5);

    if (!cleanValue) {
      const newOtp = [...otpArray];
      newOtp[index] = "";
      setOtpArray(newOtp);
      return;
    }

    if (cleanValue.length > 1) {
      const newOtp = ["", "", "", "", ""];

      cleanValue.split("").forEach((digit, i) => {
        if (i < 5) newOtp[i] = digit;
      });

      setOtpArray(newOtp);
      return;
    }

    const newOtp = [...otpArray];
    newOtp[index] = cleanValue;
    setOtpArray(newOtp);

    if (index < 4) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 5)
    if (!/^\d+$/.test(paste)) return

    const newOtp = paste.split('')
    setOtpArray(newOtp)

    setTimeout(() => {
      document.getElementById(`otp-${newOtp.length - 1}`).focus()
    }, 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[40000]"
            onClick={() => {
              if (!loading) {
                onClose?.();
              }
            }}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[40001] p-4">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 80 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
              className="w-full relative max-w-3xl bg-white min-h-[600px] rounded-2xl shadow-2xl overflow-hidden"
            >

              <button
                onClick={() => {
                  if (!loading) {
                    onClose?.();
                  }
                }}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <img className="w-[220px] absolute opacity-[0.3] bottom-0" src={Cow} />
              <img className=" w-[200px] lg:w-[250px] right-0 absolute opacity-[0.3] bottom-0" src={honey} />

              <div className="flex flex-col justify-between p-4 md:p-10">

                {!showSuccess ? (
                  <>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-fit mx-auto"
                    >
                      <img className="w-[140px] mx-auto" src={logo} />
                      <h2 className="lg:text-3xl font-[600] text-gray-900 text-center">
                        Welcome to Gawdee
                      </h2>
                      <p className="text-gray-600 text-[10px] text-center">
                        Continue your healthy journey
                      </p>
                    </motion.div>

                    <div className=" flex flex-col lg:grid grid-cols-2 gap-[15px] mt-[20px] lg:mt-[50px]">

                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex order-2 lg:order-1 flex-col justify-center px-3 space-y-3"
                      >
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Pure Wellness Starts Here 🌿
                        </h2>

                        <p className="text-sm text-gray-600">
                          Join Gawdee and experience the goodness of natural products.
                        </p>

                        <div className="space-y-2">
                          <p>✔ 100% Natural Products</p>
                          <p>✔ Trusted by Thousands</p>
                          <p>✔ Fast & Safe Delivery</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex order-1 lg:order-2  w-full flex-col  h-fit mx-auto shadow-md bg-white rounded-[10px] lg:w-[350px] border p-[16px] gap-[15px]"
                      >
                        {step === "mobile" ? (
                          <>
                            <Input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="tel"
                              placeholder="Enter mobile number"
                              value={mobile}
                              onChange={(e) =>
                                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                              }
                            />

                            <Button
                              onClick={handleSendOtp}
                              disabled={!mobile.trim() || loading}
                              className="w-full bg-gradient-to-r from-[#0c776b]  to-emerald-500 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? (
                                <>
                                  <Loader2 size={18} className="mr-2 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                'Send OTP'
                              )}
                            </Button>
                          </>
                        ) : (
                          <>
                            <div
                              className="flex justify-between w-[100%] gap-2"
                              onPaste={handleOtpPaste}
                            >
                              <div className="relative">

                                <input
                                  id="otp-hidden"
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  autoComplete="one-time-code"
                                  value={otpArray.join("")}
                                  maxLength={5}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);

                                    setOtpArray([
                                      value[0] || "",
                                      value[1] || "",
                                      value[2] || "",
                                      value[3] || "",
                                      value[4] || "",
                                    ]);

                                    if (value.length === 5) {
                                      fillOtpAndVerify(value);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-[0.01] z-10 text-transparent bg-transparent"
                                />

                                <div className="flex justify-between  w-[312px]  mx-auto    items-center gap-2 pointer-events-none">
                                  {otpArray.map((digit, index) => (
                                    <div
                                      key={index}
                                      className="w-12 h-12 md:w-[50px] flex items-center justify-center text-[16px] font-[500] border border-gray-300 rounded-lg"
                                    >
                                      {digit}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={handleVerifyOtp}
                              disabled={finalOtp.length !== 5 || loading}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? (
                                <>
                                  <Loader2 size={18} className="mr-2 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                'Verify & Login'
                              )}
                            </Button>
                          </>
                        )}
                      </motion.div>

                    </div>
                  </>
                ) : (

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      🌿
                    </div>

                    <h3 className="text-xl font-semibold">Welcome to Gawdee</h3>
                    <p className="text-gray-500 text-sm">
                      You’re now part of a healthier lifestyle
                    </p>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}