import { createSlice, current } from "@reduxjs/toolkit";
import {
  approveOrder,
  generateMultipleInvoices,
  getApprovelList,
  getClientsOrderList,
  getInvoice,
  getInvoiceDetails,
  getOrderByID,
  getPostpaidOrdersCount,
  orderDetails,
  orderInProcess,
  orderListing,
  pendingApprovalCount,
  updateInvoiceStatus,
} from "redux/asyncApi/orderApi";
import { reset } from "./appSlice";
import { filtredData } from "util/helpers";
import _ from "lodash";

const initialState = {
  order_listing: {
    message: null,
    status: false,
  },
  clients_order_listing: {
    message: null,
    status: false,
  },
  approval_list: {},
  order_details: {},
  order_In_Process: {},
  getOrderDetails: {},
  error: {
    message: null,
    status: false,
  },
  approval_count: 0,
  status: "",
  invoiceDetails: null,
  custom_invoice_details: {},
  postpaid_orders_count:0
};

// Then, handle actions in your reducers:
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    tableDes: (state, payload) => {
      state.order_details = {};
    },
  },
  extraReducers: (builder) => {
    //clear state
    builder.addCase(reset, () => {
      return initialState;
    });

    // get order listing
    builder.addCase(orderListing.fulfilled, (state, action) => {
      state.order_listing = action.payload;
      state.status = "success";
    });
    builder.addCase(orderListing.rejected, (state, action) => {
      state.order_listing = action.payload;
      state.status = "failed";
    });
    builder.addCase(orderListing.pending, (state) => {
      state.status = "pending";
    });

    // get order details
    builder.addCase(orderDetails.fulfilled, (state, action) => {
      state.order_details = action.payload;
      state.status = "success";
    });
    builder.addCase(orderDetails.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(orderDetails.pending, (state) => {
      state.status = "pending";
    });

    // get approval list
    builder.addCase(getApprovelList.fulfilled, (state, action) => {
      state.approval_list = action.payload;
      state.status = "success";
    });
    builder.addCase(getApprovelList.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getApprovelList.pending, (state) => {
      state.status = "pending";
    });

    // order in process
    builder.addCase(orderInProcess.fulfilled, (state, action) => {
      state.order_In_Process = action.payload;
      state.status = "success";
    });
    builder.addCase(orderInProcess.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(orderInProcess.pending, (state) => {
      state.status = "pending";
    });

    // update approve order
    builder.addCase(approveOrder.fulfilled, (state, action) => {
      const { payload } = action;
      const approval_list = current(state.approval_list.data);
      const filtred = filtredData(approval_list, payload);
      state.approval_list = {
        ...state.approval_list,
        data: [...filtred],
        wallet: payload.wallet,
      };
      state.status = "success";
    });
    builder.addCase(approveOrder.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(approveOrder.pending, (state) => {
      state.status = "pending";
    });

    // get order by id
    builder.addCase(getOrderByID.fulfilled, (state, action) => {
      state.getOrderDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(getOrderByID.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getOrderByID.pending, (state) => {
      state.status = "pending";
    });

    // get order by id
    builder.addCase(pendingApprovalCount.fulfilled, (state, action) => {
      state.approval_count = action.payload?.approval_count;
      state.status = "success";
    });
    builder.addCase(pendingApprovalCount.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(pendingApprovalCount.pending, (state) => {
      state.status = "pending";
    });

    // get postpaid orders count
    builder.addCase(getPostpaidOrdersCount.fulfilled, (state, action) => {
      state.postpaid_orders_count = action.payload?.total_order_count;
      state.status = "success";
    });
    builder.addCase(getPostpaidOrdersCount.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getPostpaidOrdersCount.pending, (state) => {
      state.status = "pending";
    });

    // get invoice
    builder.addCase(getInvoice.fulfilled, (state, action) => {
      state.invoiceDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(getInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getInvoice.pending, (state) => {
      state.status = "pending";
    });

    // get clients order list
    builder.addCase(getClientsOrderList.fulfilled, (state, action) => {
      state.clients_order_listing = action.payload;
      state.status = "success";
    });
    builder.addCase(getClientsOrderList.rejected, (state, action) => {
      state.error = action.payload;
      state.clients_order_listing = action.payload.data;
      state.status = "failed";
    });
    builder.addCase(getClientsOrderList.pending, (state) => {
      state.status = "pending";
    });

    //update invoice status

    builder.addCase(updateInvoiceStatus.fulfilled, (state, action) => {
      const { payload } = action;
      const order_list = current(state?.clients_order_listing?.data);
      const filtred = _.uniqBy([...payload.data, ...order_list], "id").sort(
        (a, b) => b.id - a.id
      );
      state.clients_order_listing = {
        ...state.clients_order_listing,
        data: [...filtred],
      };
      state.status = "success";
    });
    builder.addCase(updateInvoiceStatus.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateInvoiceStatus.pending, (state) => {
      state.status = "pending";
    });

    // get invoice details

    builder.addCase(getInvoiceDetails.fulfilled, (state, action) => {
      state.custom_invoice_details = action.payload;
      state.status = "success";
    });
    builder.addCase(getInvoiceDetails.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getInvoiceDetails.pending, (state) => {
      state.status = "pending";
    });

    // generat client invoices
    builder.addCase(generateMultipleInvoices.fulfilled, (state, action) => {
      const { payload } = action;
      const order_list = current(state?.clients_order_listing.data);
      const filtred = _.uniqBy([...payload.data, ...order_list], "id").sort(
        (a, b) => b.id - a.id
      );
      state.clients_order_listing = {
        ...state.clients_order_listing,
        data: [...filtred],
      };
      state.status = "success";
    });
    builder.addCase(generateMultipleInvoices.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(generateMultipleInvoices.pending, (state) => {
      state.status = "pending";
    });
  },
});

export const { tableDes } = orderSlice.actions;
export default orderSlice.reducer;
