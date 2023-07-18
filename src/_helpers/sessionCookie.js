import Cookies from "js-cookie";

const sessionCookie = {
  get: function (key) {
    return Cookies.get(key);
  },
  set: function (key, value, options = {}) {
    Cookies.set(key, value, {
      secure: true,
      sameSite: "strict",
      ...options,
    });
  },
  remove: function (key) {
    Cookies.remove(key);
  },
};

export { sessionCookie };
