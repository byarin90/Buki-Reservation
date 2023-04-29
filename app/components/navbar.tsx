"use client";
// Import necessary components, hooks, and context
import Link from "next/link";
import AuthModal from "./authModal";
import { useContext } from "react";
import { AuthenticationContext } from "../context/authContext";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  // Access data and loading state from the AuthenticationContext
  const { data, loading } = useContext(AuthenticationContext);

  // Access the signout function from the useAuth hook
  const { signout } = useAuth();

  return (
    <nav className="bg-white p-2 flex justify-between">
      {/*  Render the main logo and link to the home page */}
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        BukiReservation
      </Link>
      {/* Show content depending on the loading state */}
      {loading ? null : (
        <div className="flex">
          {/*  If the user is authenticated, show the Sign out button */}
          {data ? (
            <button
              onClick={signout}
              className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
            >
              Sign out
            </button>
          ) : (
            // If the user is not authenticated, show Sign in and Sign up buttons
            <>
              <AuthModal isSignin={true} />
              <AuthModal isSignin={false} />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
