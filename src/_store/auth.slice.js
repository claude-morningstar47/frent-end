import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { alertActions } from ".";
import { instanceHttp, customHistory, sessionCookie } from "../_helpers";

import CryptoJS from "crypto-js";

const name = "auth";
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers });

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

function createInitialState() {
  let cle_crypto =
    "969262841ebd74718661d32cee2d6ee65d912010a8d4a53365cdf0496ebe4ea1";

  const encryptedAuthUser = localStorage.getItem("encryptedAuthUser");
  const encryptedAuthToken = localStorage.getItem("encryptedAuthToken");

  if (encryptedAuthUser && encryptedAuthToken) {
    const decryptedAuthUser = CryptoJS.AES.decrypt(
      encryptedAuthUser,
      cle_crypto
    );
    const decryptedAuthToken = CryptoJS.AES.decrypt(
      encryptedAuthToken,
      cle_crypto
    );

    const serializedAuthUser = decryptedAuthUser.toString(CryptoJS.enc.Utf8);
    const serializedAuthToken = decryptedAuthToken.toString(CryptoJS.enc.Utf8);

    const { userlog, roles } = JSON.parse(serializedAuthUser);

    const { accessToken, refreshToken } = JSON.parse(serializedAuthToken);

    return {
      user: userlog || {},
      roles: roles || [],
      accessToken: accessToken || "",
      refreshToken: refreshToken || "",
      isLogged: !!accessToken,
    };
  }

  return {
    user: null,
    roles: [],
    accessToken: "",
    refreshToken: "",
    isLogged: false,
  };
}

function createReducers() {
  return {
    setAuth: function (state, action) {
      const { userlog, roles, accessToken, refreshToken } = action.payload;
      state.user = userlog;
      state.roles = roles;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isLogged = !!accessToken;
    },
  };
}

function createExtraActions() {
  return {
    signin: createAsyncThunk(
      `${name}/signin`,
      async function ({ email, password }, { dispatch }) {
        // dispatch(alertActions.clear());

        try {
          const response = await instanceHttp.post("/auth/signin", {
            email,
            password,
          });

          const { userlog, roles, accessToken, refreshToken } = response.data;

          const serializedAuthUser = JSON.stringify({ userlog, roles });
          const serializedAuthToken = JSON.stringify({
            accessToken,
            refreshToken,
          });

          const encryptedAuthUser = CryptoJS.AES.encrypt(
            serializedAuthUser,
            "969262841ebd74718661d32cee2d6ee65d912010a8d4a53365cdf0496ebe4ea1"
          );
          const encryptedAuthToken = CryptoJS.AES.encrypt(
            serializedAuthToken,
            "969262841ebd74718661d32cee2d6ee65d912010a8d4a53365cdf0496ebe4ea1"
          );

          localStorage.setItem(
            "encryptedAuthUser",
            encryptedAuthUser.toString()
          );
          localStorage.setItem(
            "encryptedAuthToken",
            encryptedAuthToken.toString()
          );

          sessionCookie.set("encryptedAuthUser", encryptedAuthUser, {
            secure: true,
            sameSite: "strict",
          });
          sessionCookie.set("encryptedAuthToken", encryptedAuthToken, {
            secure: true,
            sameSite: "strict",
          });

          dispatch(
            authActions.setAuth({ userlog, roles, accessToken, refreshToken })
          );

          const { from } = customHistory.location.state || {
            from: { pathname: "/", replace: true },
          };
          customHistory.navigate(from);
        } catch (error) {
          console.log(error);
          dispatch(alertActions.error(error.message));
        }
      }
    ),
    logout: createAsyncThunk(
      `${name}/logout`,
      async function (_, { dispatch }) {
        dispatch(
          authActions.setAuth({
            userlog: null,
            roles: [],
            accessToken: "",
            refreshToken: "",
            isLogged: false,
          })
        );
        const { user } = createInitialState();
        const _id = user.id;
        instanceHttp.post(`/auth/logout`, { _id }).catch((error) => {
          console.error("Logout API call failed:", error);
        });

        localStorage.removeItem("encryptedAuthUser");
        localStorage.removeItem("encryptedAuthToken");
        const { from } = customHistory.location.state || {
          from: { pathname: "/auth/signin", replace: true },
        };

        customHistory.navigate(from);
      }
    ),
  };
}
