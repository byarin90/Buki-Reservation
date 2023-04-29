import Navbar from "./components/navbar";
import AuthContext from "./context/authContext";
import "./globals.css";

// Define the RootLayout component
export default function RootLayout({
  children, // Prop containing child components to be rendered within the RootLayout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        The <head /> element will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          {/*
            The AuthContext component provides authentication state and a function
            for updating the state to its children components.
            Values provided are: {
              loading: false,
              error: null,
              data: null,
              setAuthState: () => {}
            }
          */}
          <AuthContext>
            <main className="max-w-screen-2xl m-auto bg-white">
              {/* Render the Navbar component */}
              <Navbar />
              {/* Render the child components passed to RootLayout */}
              {children}
            </main>
          </AuthContext>
        </main>
      </body>
    </html>
  );
}