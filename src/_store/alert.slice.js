import { createSlice } from "@reduxjs/toolkit";

const name = "alert";
const initialState = createInitialState();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers });

export const alertActions = { ...slice.actions };
export const alertReducer = slice.reducer;

function createInitialState() {
  return {
    value: null,
  };
}
function createReducers() {
  return {
    success,
    error,
    clear,
  };

  function success(state, action) {
    state.value = {
      type: "success",
      message: action.payload?.message || action.payload,
      showAftrRedirect: action.payload?.showAftrRedirect,
    };
  }
  function error(state, action) {
    state.value = {
      type: "failure",
      message: action.payload?.message || action.payload,
      showAftrRedirect: action.payload?.showAftrRedirect,
    };
  }

  function clear(state) {
    if (state.value?.showAftrRedirect) {
      state.value.showAftrRedirect = false;
    } else {
      state.value = null;
    }
  }
}
