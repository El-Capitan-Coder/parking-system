import React, { createContext, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{ user: null, logout: () => {} }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
