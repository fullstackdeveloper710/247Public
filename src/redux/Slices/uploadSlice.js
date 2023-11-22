import { createSlice, current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  accessibilityFiles,
  applyCouponCode,
  confirmUploadedFiles,
  customOrderPlaced,
  downloadAllPdf,
  downloadAllReport,
  downloadReport,
  download_pdf,
  getCustomUsers,
  getFileTypes,
  getOrderInformation,
  getbraintreeToken,
  makePayment,
  orderPlaced,
  removeFile,
  updateAllSlaTypes,
  updateSlaType,
  uploadFiles,
  uploadInvoice,
} from "redux/asyncApi/uploadApi";

import _ from "lodash";
import { reset } from "./appSlice";
import { filtredData } from "util/helpers";

const initialState = {
  uploadedFiles: {
    data: [],
    total_files: 0,
    uploaded_file_size: 0,
  },
  error: {
    message: null,
  },
  accessibilityPage: {},
  fileTypes: [],
  braintreeToken: null,
  uploadFileCount: 0,
  fileLoaded: 0,
  orderInformationList: {
    address: null,
    data: [],
    balance_payable: 0,
    total: 0,
    total_discount: 0,
  },
  invoiceDetails: {},
  slaList: { data: [] },
  disabledSla: false,
  confirmSlaList: [],
  billingInfo: false,
  selectedUser: null,
};

// Then, handle actions in your reducers:
const uploadSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    accessibility: (state, action) => {
      state.accessibilityPage = action.payload;
    },
    confirmedFiles: (state, action) => {
      state.uploadedFiles.data = action.payload;
    },
    uploadProgress: (state, action) => {
      state.fileLoaded = action.payload;
    },
    clearUploadErrors: (state, action) => {
      state.error.message = null;
    },
    updateUserId: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearState: () => initialState,
  },

  extraReducers: (builder) => {
    //clear state
    builder.addCase(reset, () => {
      return initialState;
    });
    // download pdf
    builder.addCase(download_pdf.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(download_pdf.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(download_pdf.pending, (state) => {
      state.status = "pending";
    });

    // download all pdf
    builder.addCase(downloadAllPdf.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(downloadAllPdf.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(downloadAllPdf.pending, (state) => {
      state.status = "pending";
    });

    // download report
    builder.addCase(downloadReport.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(downloadReport.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(downloadReport.pending, (state) => {
      state.status = "pending";
    });

    // download all report
    builder.addCase(downloadAllReport.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(downloadAllReport.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(downloadAllReport.pending, (state) => {
      state.status = "pending";
    });

    // upload files
    builder.addCase(uploadFiles.fulfilled, (state, action) => {
      state.uploadedFiles = {
        ...action.payload,
      };
      state.status = "success";
    });
    builder.addCase(uploadFiles.rejected, (state, action) => {
      // state.error = action.payload;
      state.uploadedFiles.status = false;
      state.status = "failed";
    });
    builder.addCase(uploadFiles.pending, (state) => {
      state.fileLoaded = 0;
      state.uploadedFiles.status = false;
      state.status = "pending";
    });

    // remove file
    builder.addCase(removeFile.fulfilled, (state, action) => {
      const { meta, payload } = action;
      state.uploadedFiles = {
        ...state.uploadedFiles,
        data: state.uploadedFiles.data.filter(
          (item) => item.id !== meta.arg.values.id
        ),
        total_files: action.payload.total_files,
        uploaded_file_size: action.payload.uploaded_file_size,
        order_temp_id:
          action.payload.total_files === 0
            ? null
            : action.payload.order_temp_id,
      };
      state.status = "success";
      toast.success(payload.msg);
    });
    builder.addCase(removeFile.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(removeFile.pending, (state) => {
      state.status = "pending";
    });

    // get file type list
    builder.addCase(getFileTypes.fulfilled, (state, action) => {
      const { meta, payload } = action;
      state.fileTypes = Object.entries(payload).map(([id, value]) => ({
        id,
        value: value.toUpperCase(),
      }));
      state.status = "success";
    });
    builder.addCase(getFileTypes.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getFileTypes.pending, (state) => {
      state.status = "pending";
    });

    // get braintree token
    builder.addCase(getbraintreeToken.fulfilled, (state, action) => {
      const { payload } = action;
      state.braintreeToken = payload.token;
      state.status = "success";
    });
    builder.addCase(getbraintreeToken.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getbraintreeToken.pending, (state) => {
      state.status = "pending";
    });

    // upload confirmFiles
    builder.addCase(confirmUploadedFiles.fulfilled, (state, action) => {
      const { payload } = action;
      state.status = "success";
    });
    builder.addCase(confirmUploadedFiles.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(confirmUploadedFiles.pending, (state) => {
      state.status = "pending";
    });

    // upload accessibilityFiles
    builder.addCase(accessibilityFiles.fulfilled, (state, action) => {
      const { payload } = action;
      state.slaList = payload;
      state.status = "success";
    });
    builder.addCase(accessibilityFiles.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(accessibilityFiles.pending, (state) => {
      state.status = "pending";
    });

    // get orderinformation
    builder.addCase(getOrderInformation.fulfilled, (state, action) => {
      const { payload } = action;
      state.orderInformationList = {
        data: [...payload.data],
        ...state.orderInformationList,
        ...payload,
      };
      state.status = "success";
    });
    builder.addCase(getOrderInformation.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getOrderInformation.pending, (state) => {
      state.status = "pending";
    });

    // apply coupon code
    builder.addCase(applyCouponCode.fulfilled, (state, action) => {
      const { payload } = action;
      state.orderInformationList = {
        ...state.orderInformationList,
        ...payload.data,
      };
      // state.message=payload.message,
      state.status = "success";
    });
    builder.addCase(applyCouponCode.rejected, (state, action) => {
      const { payload } = action;
      state.orderInformationList = {
        ...state.orderInformationList,
        ...payload.data,
      };
      state.error = {message:payload.message};
      state.status = "failed";
    });
    builder.addCase(applyCouponCode.pending, (state) => {
      state.status = "pending";
    });

    // update sla type
    builder.addCase(makePayment.fulfilled, (state, action) => {
      const { payload } = action;
      state.invoiceDetails = { ...payload };
      state.billingInfo = true;
      state.status = "success";
    });
    builder.addCase(makePayment.rejected, (state, action) => {
      // state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(makePayment.pending, (state) => {
      state.status = "pending";
    });

    // update Sla type
    builder.addCase(updateSlaType.fulfilled, (state, action) => {
      const { payload } = action;
      const slaData = current(state.slaList.data);
      const filtred = filtredData(slaData, payload);
      state.slaList = {
        ...state.slaList,
        data: [...filtred],
      };
      const result = filtred.filter(
        (item) =>
          item.sla_type.toLowerCase() !== payload?.data?.sla_type.toLowerCase()
      );
      state.disabledSla = result.length ? true : false;
      state.status = "success";
    });
    builder.addCase(updateSlaType.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateSlaType.pending, (state) => {
      state.status = "pending";
    });

    // update Multiple Sla types
    builder.addCase(updateAllSlaTypes.fulfilled, (state, action) => {
      const { payload } = action;
      state.slaList = {
        ...state.slaList,
        data: [...payload.data],
      };
      state.status = "success";
    });
    builder.addCase(updateAllSlaTypes.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateAllSlaTypes.pending, (state) => {
      state.status = "pending";
    });

    // upload invoice
    builder.addCase(uploadInvoice.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(uploadInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(uploadInvoice.pending, (state) => {
      state.status = "pending";
    });

    // Order Placed
    builder.addCase(orderPlaced.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(orderPlaced.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(orderPlaced.pending, (state) => {
      state.status = "pending";
    });
  },
});

export const {
  accessibility,
  confirmedFiles,
  uploadProgress,
  clearUploadErrors,
  clearState,
  updateUserId,
} = uploadSlice.actions;
export default uploadSlice.reducer;
