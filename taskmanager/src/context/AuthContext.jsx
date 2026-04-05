import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ------Persist / remove token --------------
  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // -- Load user from token (called on mount) -----------
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me"); // your "get current user" endpoint
      setUser(data.user ?? data); // handle {user: {...}} or
    } catch (error) {
      // token is invalid / expired - clean up silently
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []); // runs once on mount

  // -------Login-------------
  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      saveToken(data.token);
      setUser(data.user ?? data);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ?? "Login failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  //-----Register------
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username: name,
        email,
        password,
      });

      saveToken(data.token);
      setUser(data.user ?? data);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ??
        "Registration failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // -----Logout-----
  const logout = () => {
    clearToken();
    setUser(null);
  };

  // -----Context Value------
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -- Custom hook for easy consumption--
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
};

export default AuthContext;
