import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username });
      setUser(res.data);
      localStorage.setItem("chatUser", JSON.stringify(res.data));
      return true;
    } catch (err) {
      console.error("Login failed:", err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chatUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
