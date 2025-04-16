
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user type
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    email: 'admin@logistics.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@logistics.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = () => {
      console.log("Checking session...");
      try {
        const storedUser = localStorage.getItem('logisticsUser');
        if (storedUser) {
          console.log("Found stored user:", storedUser);
          setUser(JSON.parse(storedUser));
        } else {
          console.log("No stored user found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    console.log("Login attempt:", email);
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          console.log("Login successful for:", foundUser.email);
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('logisticsUser', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          console.log("Login failed: Invalid credentials");
          reject(new Error('Invalid credentials'));
        }
      }, 800); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    console.log("Logging out user");
    setUser(null);
    localStorage.removeItem('logisticsUser');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  console.log("Auth context state:", { isAuthenticated: !!user, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
