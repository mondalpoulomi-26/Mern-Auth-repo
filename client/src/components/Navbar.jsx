import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const {
    userData,
    backendUrl,
    setUserData,
    setIsLoggedin,
  } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  // Send Email Verification OTP
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
        setShowMenu(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/logout"
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        setShowMenu(false);

        navigate("/login");
        toast.success("Logged out successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 sm:px-24 py-4 absolute top-0 z-50">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {userData ? (
        <div className="relative">
          {/* Avatar */}
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold cursor-pointer select-none"
          >
            {userData.name.charAt(0).toUpperCase()}
          </div>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border overflow-hidden">
              <ul>
                {/* Show only if email is NOT verified */}
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}

                {/* Logout */}
                <li
                  onClick={logout}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;