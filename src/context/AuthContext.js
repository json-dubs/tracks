import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", ...state, token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", paylod: token });
    navigate("TrackList");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = (dispatch) => async ({ email, password }) => {
  // make API request to sign up with email and password
  try {
    const response = await trackerApi.post("/signup", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    // if we sign up, modify our state and say we are authenticated
    dispatch({ type: "signin", payload: response.data.token });
    console.log(response.data);
    // navigate to main flow
    navigate("TrackList");
    // if signup fails, we need to reflect an error message
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with signup",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  // make API request to sign in with email and password
  try {
    const response = await trackerApi.post("/signin", { email, password });

    // if we sign in, modify our state and say we are signed in
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("TrackList");
    // if signin fails, we need to reflect an error message
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
  }
};

const signout = (dispatch) => async () => {
  // make API request to sign out
  const response = await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
