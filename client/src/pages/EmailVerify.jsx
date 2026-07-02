import React, { useContext, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const {
    backendUrl,
    getUserData,
    userData,
    isLoggedin,
  } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, navigate]);

  const handleInput = (e, index) => {
    if (
      e.target.value.length > 0 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text").slice(0, 6);
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    if (pasteArray.length > 0) {
      inputRefs.current[
        Math.min(pasteArray.length - 1, 5)
      ].focus();
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otp = inputRefs.current
        .map((input) => input.value)
        .join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 pt-20">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* OTP Card */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>

        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id.
        </p>

        <div
          className="flex justify-between mb-8"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill("")
            .map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                required
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none border border-transparent focus:border-indigo-500"
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:opacity-90 transition"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;