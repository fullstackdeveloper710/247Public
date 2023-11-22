import { createSlice } from "@reduxjs/toolkit";
import { reset } from "./appSlice";
import {
  getCardDetails,
  getbillingAddress,
  payWithWallet,
  rechargeWallet,
  renewSubscriptionPlan,
  stripeAuthPayment,
  stripePayment,
  stripeSubscription,
  subscriptionChange,
  updateCardDetails,
  updatePaymentAddress,
  updateSubscription,
  updateWallet,
  walletRechargeRetrive,
} from "redux/asyncApi/paymentApi";
import { customOrderPlaced } from "redux/asyncApi/uploadApi";

const initialState = {
  paymentData: {},
  status: "",
  error: "",
  billingInfo: {
    result: { address: null },
  },
  cardDetail: {
    result: null,
  },
};

// Then, handle actions in your reducers:
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    //clear state
    builder.addCase(reset, () => {
      return initialState;
    });

    //  stripe payment
    builder.addCase(stripePayment.fulfilled, (state, action) => {
      state.paymentData = action.payload;
      state.status = "success";
    });
    builder.addCase(stripePayment.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(stripePayment.pending, (state) => {
      state.status = "pending";
    });

    //  stripe subscription
    builder.addCase(stripeSubscription.fulfilled, (state, action) => {
      state.paymentData = action.payload;
      state.status = "success";
    });
    builder.addCase(stripeSubscription.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(stripeSubscription.pending, (state) => {
      state.status = "pending";
    });

    //  stripe get billing info
    builder.addCase(getbillingAddress.fulfilled, (state, action) => {
      state.billingInfo = action.payload;
      state.status = "success";
    });
    builder.addCase(getbillingAddress.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getbillingAddress.pending, (state) => {
      state.status = "pending";
    });

    //  get card details
    builder.addCase(getCardDetails.fulfilled, (state, action) => {
      state.cardDetail = action.payload;
      state.status = "success";
    });
    builder.addCase(getCardDetails.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getCardDetails.pending, (state) => {
      state.status = "pending";
    });

    //  update card details
    builder.addCase(updateCardDetails.fulfilled, (state, action) => {
      // state.cardDetail = action.payload;
      state.status = "success";
    });
    builder.addCase(updateCardDetails.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateCardDetails.pending, (state) => {
      state.status = "pending";
    });

    //  update payment addresss
    builder.addCase(updatePaymentAddress.fulfilled, (state, action) => {
      state.cardDetail = action.payload;
      state.status = "success";
    });
    builder.addCase(updatePaymentAddress.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updatePaymentAddress.pending, (state) => {
      state.status = "pending";
    });

    //  update subscription
    builder.addCase(updateSubscription.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(updateSubscription.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateSubscription.pending, (state) => {
      state.status = "pending";
    });

    //  update subscription
    builder.addCase(updateWallet.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(updateWallet.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateWallet.pending, (state) => {
      state.status = "pending";
    });

    //  stripe auth payment
    builder.addCase(stripeAuthPayment.fulfilled, (state, action) => {
      state.paymentData = action.payload;
      state.status = "success";
    });
    builder.addCase(stripeAuthPayment.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(stripeAuthPayment.pending, (state) => {
      state.status = "pending";
    });

    // Custom Order Placed
    builder.addCase(customOrderPlaced.fulfilled, (state, action) => {
      const { payload } = action;
      state.paymentData = payload;
      state.status = "success";
    });
    builder.addCase(customOrderPlaced.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(customOrderPlaced.pending, (state) => {
      state.status = "pending";
    });

    // recharge wallet
    builder.addCase(rechargeWallet.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(rechargeWallet.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(rechargeWallet.pending, (state) => {
      state.status = "pending";
    });

    // wallet recharge retrive
    builder.addCase(walletRechargeRetrive.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(walletRechargeRetrive.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(walletRechargeRetrive.pending, (state) => {
      state.status = "pending";
    });

    // pay with wallet
    builder.addCase(payWithWallet.fulfilled, (state, action) => {
      const { payload } = action;
      state.paymentData = payload;
      state.status = "success";
    });
    builder.addCase(payWithWallet.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(payWithWallet.pending, (state) => {
      state.status = "pending";
    });

    // subscription change with wallet
    builder.addCase(subscriptionChange.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(subscriptionChange.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(subscriptionChange.pending, (state) => {
      state.status = "pending";
    });

     // renew subscription plan
     builder.addCase(renewSubscriptionPlan.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(renewSubscriptionPlan.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(renewSubscriptionPlan.pending, (state) => {
      state.status = "pending";
    });
  },
});

export const {} = paymentSlice.actions;
export default paymentSlice.reducer;
