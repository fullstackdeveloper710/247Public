import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  hideLoader,
  showLoader,
  updateWalletBalance,
} from "redux/Slices/appSlice";
import { services } from "services/async_api";
import { handleErrors } from "services/handleErrors";

export const orderListing = createAsyncThunk(
  "order/orderListing",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.orderListing(data);
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

// user details
export const orderDetails = createAsyncThunk(
  "order/orderDetails",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.orderDetails(data);
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

// get order by id
export const getOrderByID = createAsyncThunk(
  "order/getOrderByID",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_order_by_id(data);
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

// order in process
export const orderInProcess = createAsyncThunk(
  "order/orderInProcess",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.order_in_process(token);
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

// get pending approvals
export const pendingApprovalCount = createAsyncThunk(
  "order/pendingApprovalCount",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.pending_approvals_count(token);
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

// update approval_order
export const approveOrder = createAsyncThunk(
  "order/approveOrder",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.approve_order(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        if (response?.data?.updated_balance) {
          thunkApi.dispatch(
            updateWalletBalance(response?.data?.updated_balance)
          );
        }
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

//get approval list
export const getApprovelList = createAsyncThunk(
  "order/getApprovelList",
  async (token, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_approval_list(token);
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

//get approval list
export const getInvoice = createAsyncThunk(
  "order/getInvoice",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_invoice(data);
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

//get clients order list
export const getClientsOrderList = createAsyncThunk(
  "order/getClientsOrderList",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_clients_order_list(data);
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

//get clients order list
export const generateMultipleInvoices = createAsyncThunk(
  "order/generateMultipleInvoices",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.generate_multiple_invoices(data);
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

export const getInvoiceDetails = createAsyncThunk(
  "order/getInvoiceDetails",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_invoice_details(data);
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

export const updateInvoiceStatus = createAsyncThunk(
  "order/updateInvoiceStatus",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.update_invoice_status(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        toast.success("Invoice mark as paid successfully.");
      }
      return response.data;
    } catch (err) {
      thunkApi.dispatch(hideLoader());
      handleErrors(err);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

//get postpaid orders count
export const getPostpaidOrdersCount = createAsyncThunk(
  "order/getPostpaidOrdersCount",
  async (token, thunkApi) => {
    try {
      const response = await services.get_postpaid_orders_count(token);
      return response.data;
    } catch (err) {
      handleErrors(err);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);
