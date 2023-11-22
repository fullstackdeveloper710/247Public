import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "redux/Slices/appSlice";
import { uploadProgress } from "redux/Slices/uploadSlice";
import { handleErrors } from "services/handleErrors";
import { services } from "services/async_api";

// download pdf
export const download_pdf = createAsyncThunk(
  "upload/downloadPdf",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.downloadPdf(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        const url = response.data.pathToFile;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("target", "_blank");
        link.setAttribute("download", data.values.fileName);
        document.body.appendChild(link);
        link.click();
      }
      return response;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// download all pdf
export const downloadAllPdf = createAsyncThunk(
  "upload/downloadAllPdf",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.download_all_pdf(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        const url = response.data.file;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download",response?.data?.file_name);
        document.body.appendChild(link);
        link.click();
      }
      return response;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// download single report
export const downloadReport = createAsyncThunk(
  "upload/downloadReport",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.download_report(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        const url = response.data.file;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download",response?.data?.file_name);
        document.body.appendChild(link);
        link.click();
      }
      return response;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// download all reports
export const downloadAllReport = createAsyncThunk(
  "upload/downloadAllReport",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.download_all_report(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        const url = response.data.file;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response?.data?.file_name);
        document.body.appendChild(link);
        link.click();
      }
      return response;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

//upload files
export const uploadFiles = createAsyncThunk(
  "upload/uploadFiles",
  async (data, thunkApi) => {
    try {
      const response = await services.upload_files(data, (progressEvent) =>
        thunkApi.dispatch(
          uploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        )
      );
      if (response) {
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const removeFile = createAsyncThunk(
  "users/removeFile",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.remove_file(data);
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

export const getFileTypes = createAsyncThunk(
  "users/getFileTypes",
  async (_, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_file_type_list();
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

// First, create the thunk
export const confirmUploadedFiles = createAsyncThunk(
  "upload/confirmUploadedFiles",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.confirm_files(data);
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

// First, create the thunk
export const accessibilityFiles = createAsyncThunk(
  "upload/accessibilityFiles",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.accessibility_files(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        // data.handleNext();
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// First, create the thunk
export const getOrderInformation = createAsyncThunk(
  "upload/getOrderInformation",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_order_information(data);
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

// First, create the thunk
export const getbraintreeToken = createAsyncThunk(
  "upload/getbraintreeToken",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.get_braintree_token(data);
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

// First, create the thunk
export const applyCouponCode = createAsyncThunk(
  "upload/applyCouponCode",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.apply_coupon(data);
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

// First, create the thunk
export const makePayment = createAsyncThunk(
  "upload/makePayment",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const response = await services.make_payment(data);
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

//updateSlaType, create the thunk
export const updateSlaType = createAsyncThunk(
  "upload/updateSlaType",
  async (data, thunkApi) => {
    try {
      const response = await services.update_sla_type(data);
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// updateAllSlaType, create the thunk
export const updateAllSlaTypes = createAsyncThunk(
  "upload/updateAllSlaTypes",
  async (data, thunkApi) => {
    try {
      const response = await services.update_multiple_sla_type(data);
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// updateAllSlaType, create the thunk
export const uploadInvoice = createAsyncThunk(
  "upload/uploadInvoice",
  async (data, thunkApi) => {
    try {
      const response = await services.upload_invoice(data);
      if(response){
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


// orderplaced, create the thunk
export const orderPlaced = createAsyncThunk(
  "upload/orderPlaced",
  async (data, thunkApi) => {
    try {
      const response = await services.order_placed(data);
      if(response){
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// custom order placed, create the thunk
export const customOrderPlaced = createAsyncThunk(
  "upload/customOrderPlaced",
  async (data, thunkApi) => {
    try {
      const response = await services.custom_order_placed(data);
      if(response){
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);