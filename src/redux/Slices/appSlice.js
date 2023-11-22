import { createSlice, current } from "@reduxjs/toolkit";
import _ from "lodash";
import { toast } from "react-toastify";
import {
  addDepartment,
  createPassword,
  editDepartment,
  forgetPassword,
  getBillingDetail,
  getDepartmentList,
  getMasterData,
  getUsedMemory,
  getUserDetails,
  getUserRole,
  getWalletBalance,
  register,
  resetPassword,
  sendUserContactInfo,
  signIn,
  signOut,
  updatePassword,
  updateUserDetails,
} from "redux/asyncApi/appApi";
import { filtredData } from "util/helpers";

const initialState = {
  loading: false,
  usedMemory: null,
  user_id: "12",
  userAuth: {
    token: "",
    user: {
      role: null,
      wallet_balance: "00:00",
    },
    UserSubscriptionPlan: { plan_name: "" },
    details: {
      image: null,
    },
  },
  userDetails: {},
  error: {
    message: null,
  },
  errors: null,
  masterData: {
    ORDER_STATUS: {},
  },
  departmentList: {},
  billingDetails: {},
};

// Then, handle actions in your reducers:
const rootElement = document.getElementById("root");
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    showLoader: (state, action) => {
      state.loading = true;
      rootElement.style.display = "none";
    },
    hideLoader: (state, action) => {
      state.loading = false;
      rootElement.style.display = "block";
    },
    updateWalletBalance: (state, action) => {
      const userAuth = current(state.userAuth);
      state.userAuth = {
        ...userAuth,
        user: {
          ...userAuth.user,
          wallet_balance: action.payload,
        },
      };
    },
    clearErrors: (state, action) => {
      state.errors = null;
    },
    reset: (state, action) => {
      toast.success(action.payload);
      return initialState;
    },
  },

  extraReducers: (builder) => {
    //  signIn
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.userAuth = { ...state.userAuth, ...action.payload };
      state.status = "success";
      // localStorage.setItem("token",action?.payload?.token)
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.errors = action.payload.errors;
      state.status = "failed";
    });
    builder.addCase(signIn.pending, (state) => {
      state.status = "pending";
    });

    //  signOut
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(signOut.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(signOut.pending, (state) => {
      state.status = "pending";
    });

    //  register
    builder.addCase(register.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = { message: action.payload?.errors?.email[0] };
      state.status = "failed";
    });
    builder.addCase(register.pending, (state, action) => {
      state.status = "pending";
    });

    //  get user details
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.userDetails = action.payload;
      state.userAuth.details.image = action.payload.user.profile_image;
      state.status = "success";
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getUserDetails.pending, (state) => {
      state.status = "pending";
    });

    //  forget password
    builder.addCase(forgetPassword.fulfilled, (state, action) => {
      // state.userDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(forgetPassword.rejected, (state, action) => {
      state.errors = action.payload.errors;
      state.status = "failed";
    });
    builder.addCase(forgetPassword.pending, (state) => {
      state.status = "pending";
    });

    //  reset password
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      // state.userDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.status = "pending";
    });

    //  create password
    builder.addCase(createPassword.fulfilled, (state, action) => {
      // state.userDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(createPassword.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(createPassword.pending, (state) => {
      state.status = "pending";
    });

    //  update password
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.errors = action.payload.errors;
      state.status = "failed";
    });
    builder.addCase(updatePassword.pending, (state) => {
      state.status = "pending";
    });

    //  update user details
    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      // state.userDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(updateUserDetails.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateUserDetails.pending, (state) => {
      state.status = "pending";
    });

    //  get used memory
    builder.addCase(getUsedMemory.fulfilled, (state, action) => {
      state.usedMemory = action.payload.memory_usage;
      state.status = "success";
    });
    builder.addCase(getUsedMemory.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getUsedMemory.pending, (state) => {
      state.status = "pending";
    });

    //  get masterData
    builder.addCase(getMasterData.fulfilled, (state, action) => {
      const filtred = action.payload.data.map((item) => {
        return { [item.label_value]: item.label_text };
      });
      const merged = _.merge(...filtred);
      state.masterData.ORDER_STATUS = merged;
      state.status = "success";
    });
    builder.addCase(getMasterData.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getMasterData.pending, (state) => {
      state.status = "pending";
    });

    //  get User role
    builder.addCase(getUserRole.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(getUserRole.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getUserRole.pending, (state) => {
      state.status = "pending";
    });

    //  get department list
    builder.addCase(getDepartmentList.fulfilled, (state, action) => {
      state.departmentList = action.payload;
      state.status = "success";
    });
    builder.addCase(getDepartmentList.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getDepartmentList.pending, (state) => {
      state.status = "pending";
    });

    //  add department
    builder.addCase(addDepartment.fulfilled, (state, action) => {
      state.departmentList = action.payload;
      state.status = "success";
    });
    builder.addCase(addDepartment.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addDepartment.pending, (state) => {
      state.status = "pending";
    });

    //  edit department
    builder.addCase(editDepartment.fulfilled, (state, action) => {
      const { payload } = action;
      const department_list = current(state?.departmentList?.departments);
      const filtred = filtredData(department_list, payload);
      state.departmentList = {
        ...state.departmentList,
        departments: [...filtred],
      };
      state.status = "success";
    });
    builder.addCase(editDepartment.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(editDepartment.pending, (state) => {
      state.status = "pending";
    });

    //  get wallet balance
    builder.addCase(getWalletBalance.fulfilled, (state, action) => {
      state.userAuth.user = {
        ...state.userAuth.user,
        wallet_balance: action.payload.wallet_balance,
      };
      state.status = "success";
    });
    builder.addCase(getWalletBalance.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getWalletBalance.pending, (state) => {
      state.status = "pending";
    });

    //  get billing details
    builder.addCase(getBillingDetail.fulfilled, (state, action) => {
      state.billingDetails = action.payload;
      state.status = "success";
    });
    builder.addCase(getBillingDetail.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getBillingDetail.pending, (state) => {
      state.status = "pending";
    });

    //  send user contact info
    builder.addCase(sendUserContactInfo.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(sendUserContactInfo.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(sendUserContactInfo.pending, (state) => {
      state.status = "pending";
    });
  },
});

export const {
  showLoader,
  hideLoader,
  reset,
  clearErrors,
  updateWalletBalance,
} = appSlice.actions;
export default appSlice.reducer;
