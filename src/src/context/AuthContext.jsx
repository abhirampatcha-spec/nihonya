import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nihonya-user")) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("nihonya-user", JSON.stringify(user));
    else localStorage.removeItem("nihonya-user");
  }, [user]);

  const login = (username) => {
    // simple client-side mock login
    setUser({ username, provider: "local" });
  };

  const signup = (username, extras = {}) => {
    setUser({ username, provider: extras.provider || "local", email: extras.email || "" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
