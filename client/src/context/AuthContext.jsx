import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signUp = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const signIn = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("access_token", {
      sameSite: "none", // agregado por mi
      secure: true, // agregado por mi
      // httpOnly: false,
    });
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      if (!cookies.access_token) {
        setLoading(false);
        setIsAuthenticated(false);
        // return setUser(null);
        return;
      }
      try {
        const res = await verifyTokenRequest(cookies.access_token);
        // if (!res.data) {
        //   setIsAuthenticated(false);
        //   setLoading(false);
        //   return;
        // }
        // setIsAuthenticated(true);
        // setUser(res.data);
        // setLoading(false);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
        // setUser(null);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, logout, loading, user, isAuthenticated, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
