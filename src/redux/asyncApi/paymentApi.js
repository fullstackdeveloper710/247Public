import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  hideLoader,
  showLoader,
  updateWalletBalance,
} from "redux/Slices/appSlice";
import { services } from "services/async_api";
import { handleErrors } from "services/handleErrors";

// stripe subscription, create the thunk
export const stripeSubscription = createAsyncThunk(
  "users/stripeSubscription",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.stripe_subscription(data);
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

// stripe payment, create the thunk
export const stripePayment = createAsyncThunk(
  "users/stripePayment",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.stripe_payment(data);
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

// get Billing adress, create the thunk
export const getbillingAddress = createAsyncThunk(
  "users/getbillingAddress",
  async (token, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_billing_info(token);
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

// get card details, create the thunk
export const getCardDetails = createAsyncThunk(
  "users/getCardDetails",
  async (token, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.get_card_details(token);
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

// update card details, create the thunk
export const updateCardDetails = createAsyncThunk(
  "users/updateCardDetails",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_card_details(data);
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

// update payment address, create the thunk
export const updatePaymentAddress = createAsyncThunk(
  "users/updatePaymentAddress",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_payment_address(data);
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

// update subscription address, create the thunk
export const updateSubscription = createAsyncThunk(
  "users/updateSubscription",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_subscription(data);
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

// update wallet, create the thunk
export const updateWallet = createAsyncThunk(
  "users/updateWallet",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.update_wallet(data);
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

// stripe auth payment, create the thunk
export const stripeAuthPayment = createAsyncThunk(
  "users/stripeAuthPayment",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.stripe_auth_payment(data);
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

// recharge wallet, create the thunk
export const rechargeWallet = createAsyncThunk(
  "payment/rechargeWallet",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.recharge_wallet(data);
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

// recharge wallet, create the thunk
export const walletRechargeRetrive = createAsyncThunk(
  "payment/walletRechargeRetrive",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.wallet_recharge_retrive(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        thunkApi.dispatch(updateWalletBalance(response.data.updated_balance));
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// pay with wallet, create the thunk
export const payWithWallet = createAsyncThunk(
  "payment/payWithWallet",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.pay_with_wallet(data);
      if (response) {
        thunkApi.dispatch(hideLoader());
        thunkApi.dispatch(updateWalletBalance(response.data.updated_balance));
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(hideLoader());
      handleErrors(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// subscription change, create the thunk
export const subscriptionChange = createAsyncThunk(
  "payment/subscriptionChange",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.subscription_change(data);
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

// renew subscription plan, create the thunk
export const renewSubscriptionPlan = createAsyncThunk(
  "payment/renewSubscriptionPlan",
  async (data, thunkApi) => {
    thunkApi.dispatch(showLoader());
    try {
      const response = await services.renew_subscription_plan(data);
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
