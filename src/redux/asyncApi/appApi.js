import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { hideLoader, reset, showLoader } from "redux/Slices/appSlice";
import { services } from "services/async_api";
import { handleErrors } from "services/handleErrors";

// First, create the thunk
export const signIn = createAsyncThunk("app/signIn", async (data, thunkApi) => {
  thunkApi.dispatch(showLoader());
  try {
    const response = await services.sign_in(data);
    if (response) {
      thunkApi.dispatch(hideLoader());
    }
    return response.data;
  } catch (error) {
    thunkApi.dispatch(hideLoader());
    handleErrors(error);
    return thunkApi.rejectWithValue(error.response.data);
  }
});

// SignOut, create the thunk
export const signOut = createAsyncThunk(
  "app/signOut",
  async (data, thunkApi) => {
    const { token, message } = data;
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.sign_out(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
        thunkApi.dispatch(reset(message ?? response.data.message));
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      if (error?.response?.status === 401) {
        thunkApi.dispatch(reset("Session Expired please login again"));
      } else {
        handleErrors(error);
      }
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Register, create the thunk
export const register = createAsyncThunk(
  "app/register",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.register(data);
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

// get user details, create the thunk
export const getUserDetails = createAsyncThunk(
  "app/getUserDetails",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_user_details(data);
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

// update user details, create the thunk
export const updateUserDetails = createAsyncThunk(
  "app/updateUserDetails",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_user_details(data);
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

// forget-password user details, create the thunk
export const forgetPassword = createAsyncThunk(
  "app/forgetPassword",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.forget_password(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      if (error?.response?.status === 403) {
        console.log("error");
      } else {
        handleErrors(error);
      }
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// reset-password user details, create the thunk
export const resetPassword = createAsyncThunk(
  "app/resetPassword",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.reset_password(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      // handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// create-password user details, create the thunk
export const createPassword = createAsyncThunk(
  "app/createPassword",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.create_password(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// update-password, create the thunk
export const updatePassword = createAsyncThunk(
  "app/updatePassword",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_password(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// get used memory, create the thunk
export const getUsedMemory = createAsyncThunk(
  "app/getUsedMemory",
  async (token, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_used_memory(token);
      if (response) {
        thunkApi.dispatch(hideLoader());
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// get MasterData create the thunk
export const getMasterData = createAsyncThunk(
  "app/getMasterData",
  async (type, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_master_data(type);
      if (response) {
        // thunkApi.dispatch(hideLoader());
        // toast.success(response.data.message)
      }
      return response.data;
    } catch (error) {
      // thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// get User role create the thunk
export const getUserRole = createAsyncThunk(
  "app/getUserRole",
  async (type, thunkApi) => {
    // thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_user_role(type);
      if (response) {
        // thunkApi.dispatch(hideLoader());
        // toast.success(response.data.message)
      }
      return response.data;
    } catch (error) {
      // thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


// get department list create the thunk
export const getDepartmentList = createAsyncThunk(
  "app/getDepartmentList",
  async (token, thunkApi) => {
    try {
      const response = await services.get_department_list(token);
      if (response) {
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// add department list create the thunk
export const addDepartment = createAsyncThunk(
  "app/addDepartment",
  async (data, thunkApi) => {
    try {
      const response = await services.add_department(data);
      if (response) {
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// update department list create the thunk
export const editDepartment = createAsyncThunk(
  "app/editDepartment",
  async (data, thunkApi) => {
    try {
      const response = await services.update_department(data);
      if (response) {
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// get wallet balance the thunk
export const getWalletBalance = createAsyncThunk(
  "app/getWalletBalance",
  async (token, thunkApi) => {
    try {
      const response = await services.get_wallet_balance(token);
      if (response) {
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// get Billing Detail the thunk
export const getBillingDetail = createAsyncThunk(
  "app/getBillingDetail",
  async (token, thunkApi) => {
    try {
      const response = await services.get_billing_detail(token);
      if (response) {
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// send user contact info, create the thunk
export const sendUserContactInfo = createAsyncThunk(
  "app/sendUserContactInfo",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.send_user_contact_info(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);
