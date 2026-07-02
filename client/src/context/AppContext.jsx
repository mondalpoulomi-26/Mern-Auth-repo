import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  axios.defaults.withCredentials = true;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/auth/is-auth"
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/data"
      );

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};

export default AppContextProvider;