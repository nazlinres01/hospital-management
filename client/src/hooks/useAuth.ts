import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}