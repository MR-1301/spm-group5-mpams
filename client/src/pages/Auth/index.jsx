import React, { useCallback } from "react";
import googleLogo from "assets/images/google_logo.png";
import loginLogo from "assets/images/login_picture.jpg";
import { useHistory } from "react-router-dom";
import { DASHBOARD, FIRST_LOGIN } from "routes";
import Page from "components/Page";
import { useLogin, useUserContext } from "hooks/useUser";
import { getUser } from "utils";
import { useToggle } from "react-use";
import Loader from "components/Loader";

function Auth() {
  const history = useHistory();
  const { setUser } = useUserContext();
  const { signIn } = useLogin();
  const [loading, toggleLoading] = useToggle(false);

  const onClick = useCallback(async () => {
    toggleLoading();
    const user = (await signIn())?.profileObj;
    const result = await getUser(user).catch((err) => alert(err.message));
    setUser({
      ...result,
      name: user.name,
      photo: user.imageUrl,
      description: "",
    });
    if (result.accountType === -1) history.push(FIRST_LOGIN);
    else history.push(DASHBOARD);
  }, [history, signIn, setUser, toggleLoading]);

  if (loading)
    return (
      <Loader
        className="h-screen w-screen grid place-items-center bg-gray-600"
        type="bird"
      />
    );

  return (
    <Page className="bg-gray-900 text-white grid place-items-center">
      <div className="w-5/12 flex flex-col items-center">
        <p className="text-white text-2xl font-bold mb-4 text-center">
          Login to Multi-Profession Appointment Management System
        </p>
        <div className="bg-white flex flex-col w-full items-center rounded p-4 text-black">
          <img alt="welcome" className="h-72 w-72 my-4" src={loginLogo} />
          <p className="text-center mb-4 font-bold text-lg">
            Get started with us by signing in
          </p>
          <button
            className="transition-all duration-200 ease-in-out bg-blue-700 rounded p-3 flex items-center gap-x-3 hover:bg-opacity-80"
            onClick={onClick}
          >
            <img alt="google" className="w-6 h-6" src={googleLogo} />
            <p className="text-white font-bold">Sign in with Google</p>
          </button>
        </div>
      </div>
    </Page>
  );
}

export default React.memo(Auth);
