import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error("Failed to restore session:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email, password) {
    const response = await loginRequest(email, password);

    localStorage.setItem("token", response.token);

    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return response;
  }

  async function register(username, email, password) {
    const response = await registerRequest(
      username,
      email,
      password
    );

    localStorage.setItem("token", response.token);

    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return response;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}