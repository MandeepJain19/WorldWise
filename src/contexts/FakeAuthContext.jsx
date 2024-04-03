import { createContext, useContext, useReducer } from "react";

const SIGNUP_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
const LOGIN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
const APIKEY = "AIzaSyCmv7n3d_lUR8lNRMFomW4MUa91amAUNKU";

const AuthContext = createContext();
const initialState = {
  userId: null,
  userEmail: "",
  userName: "",
  token: null,
  tokenExpiration: null,
  isLoading: false,
  error: "",
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: action.payload };
    case "error":
      return { ...state, error: action.payload, isLoading: false };
    // case "login":
    //   return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...initialState };
    case "loginSignup":
      return {
        ...state,
        userId: action.payload.userId,
        token: action.payload.token,
        tokenExpiration: action.payload.tokenExpiration,
        userEmail: action.payload.email,
        userName: action.payload.name,
        isLoading: false,
        isAuthenticated: true,
        error: "",
      };
    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [
    { userId, isAuthenticated, error, isLoading, userEmail, userName },
    dispatch,
  ] = useReducer(reducer, initialState);

  function logout() {
    dispatch({ type: "logout" });
  }
  async function loginSignup(email, password, isLogin, displayName = "") {
    const url = isLogin ? LOGIN_URL + APIKEY : SIGNUP_URL + APIKEY;
    try {
      dispatch({ type: "loading", payload: true });
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          displayName,
          email,
          password,
          returnSecureToken: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error.message || "Failed to authenticate.");
      }
      const payload = {
        token: data.idToken,
        userId: data.localId,
        tokenExpiration: data.expiresIn,
        email: data.email,
        name: data.displayName,
      };
      dispatch({ type: "loginSignup", payload });
    } catch (err) {
      dispatch({
        type: "error",
        payload: err.message,
      });
    }
  }
  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuthenticated,
        logout,
        loginSignup,
        error,
        isLoading,
        userEmail,
        userName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
