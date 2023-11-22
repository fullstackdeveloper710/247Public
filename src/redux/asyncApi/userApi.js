import { createAsyncThunk } from "@reduxjs/toolkit";
import { hideLoader, showLoader } from "redux/Slices/appSlice";
import { services } from "services/async_api";
import { handleErrors } from "services/handleErrors";

// First, create the thunk
export const fetchUserListing = createAsyncThunk(
  "users/fetchUserListing",
  async (token, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.user_listing(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// add new user
export const addNewUser = createAsyncThunk(
  "users/addNewUser",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.add_new_user(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.update_user(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// get user by id
export const getUserByID = createAsyncThunk(
  "users/getUserById",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.getUserById(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// make inactive user
export const makeInactiveUser = createAsyncThunk(
  "users/makeInactiveUser",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.make_incative_user(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// make is Admin
export const switchUser = createAsyncThunk(
  "users/switchUser",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.make_is_admin(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Dashboard
export const getDashboard = createAsyncThunk(
  "users/getDashboard",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.dashboard_data(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Chart
export const getChartData = createAsyncThunk(
  "users/getChartData",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.chart_data(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Fetch workload, create the thunk
export const fetchWorkloadListing = createAsyncThunk(
  "users/fetchWorkloadListing",
  async (token, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.workload_listing(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Fetch workload, create the thunk
export const fetchWorkloadFile = createAsyncThunk(
  "users/fetchWorkloadFile",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.workload_listing_file(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// update workload, create the thunk
export const updateWorkloadFile = createAsyncThunk(
  "users/updateWorkloadFile",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_workload_file(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Create holiday, create the thunk
export const createHoliday = createAsyncThunk(
  "users/createHoliday",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.create_holiday(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

//fetch holiday
export const fetchHolidayList = createAsyncThunk(
  "users/getHolidayList",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_holidays(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Update holiday, create the thunk
export const updateHoliday = createAsyncThunk(
  "users/updateHoliday",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_holiday(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

//Remove holiday
export const removeHoliday = createAsyncThunk(
  "users/removeHoliday",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.remove_holiday(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


// get user by id
export const getCustomUserById = createAsyncThunk(
  "users/getCustomUserById",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_custom_user_by_id(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// update new users
export const createCustomUser = createAsyncThunk(
  "users/createCustomUser",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.create_custom_user(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// update new users
export const updateCustomUser = createAsyncThunk(
  "users/updateCustomUser",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_custom_user(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


// get client/custom users list
export const getClientUsersList = createAsyncThunk(
  "users/getClientUsersList",
  async (token, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_client_users_list(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


// get client/custom user by id
export const getClientUserbyId = createAsyncThunk(
  "users/getClientUserbyId",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_client_user_by_id(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

//get custom  users list 
export const getCustomUsers = createAsyncThunk(
  "users/getCustomUsers",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_custom_user_list(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


//get custom  users list 
export const resendMail = createAsyncThunk(
  "users/resendMail",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.resend_email(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);