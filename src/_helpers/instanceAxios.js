import axios from "axios";
import CryptoJS from "crypto-js";
import { customHistory } from "./history";
import { _store, authActions } from "../_store";

const encryptionKey = '969262841ebd74718661d32cee2d6ee65d912010a8d4a53365cdf0496ebe4ea1';

function getLocalTokenData() {
  const encryptedAuthToken = localStorage.getItem("encryptedAuthToken");

  if (encryptedAuthToken) {

    const decryptedAuthToken = CryptoJS.AES.decrypt(encryptedAuthToken,
      encryptionKey
    );
    const serializedAuthToken = decryptedAuthToken.toString(CryptoJS.enc.Utf8);
    const { accessToken, refreshToken } = JSON.parse(serializedAuthToken);
    return { accessToken, refreshToken };
  }
  // Return an empty object if no token data is available
  return {};
}

function setLocalTokenData(accessToken, refreshToken) {
  const serializedAuthToken = JSON.stringify({ accessToken, refreshToken });
  const encryptedAuthToken = CryptoJS.AES.encrypt(serializedAuthToken, encryptionKey).toString();
  localStorage.setItem("encryptedAuthToken", encryptedAuthToken);
}

function redirectToLogin() {
  // Rediriger vers la page de connexion
  _store.dispatch(authActions.logout())
  customHistory.navigate("/auth/signin");
}

export const instanceHttp = axios.create({
  baseURL: "http://192.168.100.2:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instanceHttp.interceptors.request.use(
  async (config) => {
    const { accessToken } = getLocalTokenData();
    if (accessToken) {
      config.headers["x-access-token"] = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instanceHttp.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const refreshResponse = await refreshTokenH();
        const { accessToken, refreshToken } = refreshResponse.data;
        instanceHttp.defaults.headers.common["x-access-token"] = accessToken;
        setLocalTokenData(accessToken, refreshToken);

        // Réessayer la requête d'origine avec le nouveau token d'accès
        return instanceHttp(originalConfig);
      } catch (refreshError) {
        if (refreshError.response && refreshError.response.data) {
          return Promise.reject(refreshError.response.data);
        }
        return Promise.reject(refreshError);
      }
    }

    if (err.response && err.response.status === 403 && err.response.data) {
      redirectToLogin();
      return Promise.reject(err.response.data);
    }

    return Promise.reject(err);
  }
);

async function refreshTokenH() {
  // Code pour effectuer le rafraîchissement du token en utilisant l'API appropriée
  const { refreshToken } = getLocalTokenData();
  
  return instanceHttp.post("/auth/refreshtoken", {
    refreshToken,
  });
}