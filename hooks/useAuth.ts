import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/authContext";
import { removeCookies } from "cookies-next";

// Custom hook to handle user authentication operations: signin, signup, and signout
const useAuth = () => {
  // Destructure 'setAuthState' from the AuthenticationContext
  const { setAuthState } = useContext(AuthenticationContext);

  // Function to handle user signin
  const signin = async (
    { email, password }: { email: string; password: string },
    handleClose: () => void
  ) => {
    // Set the initial state for authentication: loading and no error
    setAuthState({ data: null, error: null, loading: true });

    try {
      // Send a POST request to the signin API endpoint with the user's email and password
      const response = await axios.post("http://localhost:3000/api/auth/signin", {
        email: email,
        password: password,
      });

      // Update the authentication state with the response data, set loading to false, and close the modal
      setAuthState({ data: response.data, error: null, loading: false });
      handleClose();
    } catch (error: any) {
      // Handle errors by updating the authentication state with the error message and setting loading to false
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  // Function to handle user signup
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose: () => void
  ) => {
    // Set the initial state for authentication: loading and no error
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });

    try {
      // Send a POST request to the signup API endpoint with the user's registration data
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
      });

      // Update the authentication state with the response data, set loading to false, and close the modal
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
      handleClose();
    } catch (error: any) {
      // Handle errors by updating the authentication state with the error message and setting loading to false
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  // Function to handle user signout
  const signout = async () => {
    // Remove the JWT cookie
    removeCookies("jwt");

    // Reset the authentication state to its initial values (no user data, no error, and not loading)
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  // Return the authentication operations (signin, signup, signout) to be used by components
  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;
