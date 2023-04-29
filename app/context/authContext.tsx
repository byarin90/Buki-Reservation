"use client";

// Import necessary dependencies
import { useState, createContext, useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

// Define a User interface
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

// Define a State interface for the authentication state
interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

// Define an AuthState interface that extends the State interface
// and includes a setter function for the authentication state
interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

// Create an AuthenticationContext using the AuthState interface
export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

// Define an AuthContext component
export default function AuthContext({
  children, // This is a prop containing the child components that will be wrapped by the AuthenticationContext.Provider
}: {
  children: React.ReactNode;
}) {
  // Initialize the authentication state using the useState hook
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  // Define an async function to fetch the user data
  const fetchUser = async () => {
    // Set the loading state to true
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });

    try {
      // Get the JWT from the cookie
      const jwt = getCookie("jwt");

      // If no JWT is present, set the loading state to false
      if (!jwt) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      // Make an API call to get the user data
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: jwt,
        },
      });

      // Set the Authorization header for axios
      axios.defaults.headers.common["Authorization"] = jwt;

      // Update the authentication state with the fetched data and set loading to false
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      // If an error occurs, set the error message and set loading to false
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  // Call the fetchUser function when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // Render the AuthenticationContext.Provider and pass the authentication state
  // and setter function as the value, wrapping the child components
  return (
    <AuthenticationContext.Provider
      value={{
        ...authState,
        setAuthState,
      }}
    >
      {/* This is where the child components will be rendered, wrapped by the AuthenticationContext.Provider */}

      {children}
    </AuthenticationContext.Provider>
  );
}
