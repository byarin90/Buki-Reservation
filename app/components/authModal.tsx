"use client";
import { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInputs from "./authModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/authContext";
import { Alert, CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const { error, data, setAuthState, loading } = useContext(
    AuthenticationContext
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { singin,signup } = useAuth();
  //?Wiche modal is currently open  (signin or signup)
  //TODO: make this more dynamic
  const renderContent = (signinContent: string, signup: string) => {
    return isSignin ? signinContent : signup;
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  useEffect(() => {
    if (isSignin) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.password &&
        inputs.email &&
        inputs.firstName &&
        inputs.lastName &&
        inputs.phone &&
        inputs.city
      ) {
        return setDisabled(false);
      }
    }

    setDisabled(true);
  }, [inputs]);

  const [disabled, setDisabled] = useState(true);

  const handleClick = () => {
    if (isSignin) {
      singin({ email: inputs.email, password: inputs.password },handleClose);
    }else{
      signup({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        phone: inputs.phone,
        city: inputs.city,
        password: inputs.password,
      },handleClose);
    }
  };
  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
      >
        {renderContent("Sign in", "Sign up")}
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 px-2 h-[600px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[600px]">
            {error ?  <Alert severity="error" className="mb-4">
                {error}
              </Alert>:null}

              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">
                  {renderContent("Sign In", "Create Account")}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log Into Your Account",
                    "Create Your BukiReservation Account"
                  )}
                </h2>
                <AuthModalInputs
                  handleChangeInput={handleChangeInput}
                  inputs={inputs}
                  isSignin={isSignin}
                />
                <button
                  onClick={handleClick}
                  disabled={disabled}
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
