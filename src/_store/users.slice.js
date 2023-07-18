import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instanceHttp } from "../_helpers";

// create slice
const name = "users";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const usersActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    list: null,
    item: null,
  };
}

const handleApiError = (error) => {
  const { status, data } = error.response;
  const message = `API Error: ${status} - ${data.message}`;
  throw new Error(message);
};

function createExtraActions() {
  return {
    addUser: createAsyncThunk(
      `${name}/addUser`,
      async (user) => {
        try {
          const response = await instanceHttp.post("/users", user);
          return  response.data
        } catch (error) {
          handleApiError(error)
        }
      }
    ),
    getAll: createAsyncThunk(`${name}/getAll`, async () => {
      try {
        const response = await instanceHttp.get("/users");
        return response.data;
      } catch (error) {
        handleApiError(error)

      }
    }),
    getById: createAsyncThunk(`${name}/getById`, async (userId) => {
      try {
        const response = await instanceHttp.get(`/users/${userId}`);
        return response.data;
      } catch (error) {
        handleApiError(error)

      }
    }),
    update: createAsyncThunk(
      `${name}/update`,
      async ({ userId, data }) => {
        try {
          const response = await instanceHttp.put(`/users/${userId}`, data);
          return response.data;
        } catch (error) {
          handleApiError(error)

        }
      }
    ),
    delete: createAsyncThunk(
      `${name}/delete`,
      async (userId) => {
        try {
          const response =await instanceHttp.delete(`/users/${userId}`);
          return response.data;
        } catch (error) {
          handleApiError(error)

        }
      }
    ),
  };
}


function createExtraReducers() {
  return (builder) => {
    builder
      .addCase(extraActions.getAll.pending, (state) => {
        state.list = { loading: true };
      })
      .addCase(extraActions.getAll.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(extraActions.getAll.rejected, (state, action) => {
        state.list = { error: action.error.message };
      })

      .addCase(extraActions.getById.pending, (state) => {
        state.item = { loading: true };
      })
      .addCase(extraActions.getById.fulfilled, (state, action) => {
        state.item = action.payload;
      })
      .addCase(extraActions.getById.rejected, (state, action) => {
        state.item = { error: action.error.message };
      });
  };
}
