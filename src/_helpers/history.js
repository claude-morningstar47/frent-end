// export const history = {
//   navigate: null,
//   location: null,
// };

import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const customHistory = {
  navigate: history.push,
  location: history.location,
};
