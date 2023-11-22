import { createSlice } from "@reduxjs/toolkit";
import {
  addNewUser,
  createCustomUser,
  createHoliday,
  fetchHolidayList,
  fetchUserListing,
  fetchWorkloadFile,
  fetchWorkloadListing,
  getChartData,
  getClientUserbyId,
  getClientUsersList,
  getCustomUserById,
  getCustomUsers,
  getDashboard,
  getUserByID,
  makeInactiveUser,
  switchUser,
  removeHoliday,
  resendMail,
  updateCustomUser,
  updateHoliday,
  updateUser,
  updateWorkloadFile,
} from "redux/asyncApi/userApi";
import { reset } from "./appSlice";
import { toast } from "react-toastify";

const initialState = {
  user_listing: {},
  workload_listing: {},
  workload_file: {},
  addUpdateUser: {},
  getUserDataById: {},
  error: {},
  getOrderDetails: {},
  focusId: null,
  dashboardData: null,
  get_holidays: {},
  clientUsers: {},
  clientUserById: {},
  customUsers: {
    data: null,
  },
};

// Then, handle actions in your reducers:
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    removeMessage: (state) => {
      state.addUpdateUser = {};
    },
    focusElement: (state, { payload }) => {
      state.focusId = payload;
    },
    removeUserList: (state, payload) => {
      state.user_listing = {};
    },
    clearUserErrors: (state, action) => {
      state.error = {};
    },
  },

  extraReducers: (builder) => {
    //clear state
    builder.addCase(reset, () => {
      return initialState;
    });

    //  get user listing insde Admin
    builder.addCase(fetchUserListing.fulfilled, (state, action) => {
      state.user_listing = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchUserListing.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(fetchUserListing.pending, (state) => {
      state.status = "pending";
    });

    // create user inside Admin
    builder.addCase(addNewUser.fulfilled, (state, action) => {
      state.addUpdateUser = action.payload;
      state.status = "success";
    });
    builder.addCase(addNewUser.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(addNewUser.pending, (state) => {
      state.status = "pending";
    });

    // update user
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.addUpdateUser = action.payload;
      state.status = "success";
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateUser.pending, (state) => {
      state.status = "pending";
    });

    // get user by id
    builder.addCase(getUserByID.fulfilled, (state, action) => {
      state.getUserDataById = action.payload;
      state.status = "success";
    });
    builder.addCase(getUserByID.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getUserByID.pending, (state) => {
      state.status = "pending";
    });

    // make inactive
    builder.addCase(makeInactiveUser.fulfilled, (state, action) => {
      state.addUpdateUser = action.payload;
      state.status = "success";
    });
    builder.addCase(makeInactiveUser.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(makeInactiveUser.pending, (state) => {
      state.status = "pending";
    });

    // make admin
    builder.addCase(switchUser.fulfilled, (state, action) => {
      state.addUpdateUser = action.payload;
      state.status = "success";
    });
    builder.addCase(switchUser.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(switchUser.pending, (state) => {
      state.status = "pending";
    });

    // dashboard
    builder.addCase(getDashboard.fulfilled, (state, action) => {
      state.dashboardData = action.payload;
      state.status = "success";
    });
    builder.addCase(getDashboard.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getDashboard.pending, (state) => {
      state.status = "pending";
    });

    // Chart data
    builder.addCase(getChartData.fulfilled, (state, action) => {
      state.ChartData = action.payload;
      state.status = "success";
    });
    builder.addCase(getChartData.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getChartData.pending, (state) => {
      state.status = "pending";
    });

    // Workload listing
    builder.addCase(fetchWorkloadListing.fulfilled, (state, action) => {
      state.workload_listing = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchWorkloadListing.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(fetchWorkloadListing.pending, (state) => {
      state.status = "pending";
    });

    // Workload document details
    builder.addCase(fetchWorkloadFile.fulfilled, (state, action) => {
      state.workload_file = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchWorkloadFile.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(fetchWorkloadFile.pending, (state) => {
      state.status = "pending";
    });

    //update Workload document details
    builder.addCase(updateWorkloadFile.fulfilled, (state, action) => {
      // state.workload_file = action.payload;
      state.status = "success";
    });
    builder.addCase(updateWorkloadFile.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateWorkloadFile.pending, (state) => {
      state.status = "pending";
    });

    // create Holiday
    builder.addCase(createHoliday.fulfilled, (state, action) => {
      state.status = "success";
    });
    builder.addCase(createHoliday.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(createHoliday.pending, (state) => {
      state.status = "pending";
    });

    // fetch Holidays-listing
    builder.addCase(fetchHolidayList.fulfilled, (state, action) => {
      state.get_holidays = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchHolidayList.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(fetchHolidayList.pending, (state) => {
      state.status = "pending";
    });

    // Update Holiday
    builder.addCase(updateHoliday.fulfilled, (state, action) => {
      // state.holiday_listing = action.payload;
      state.status = "success";
    });
    builder.addCase(updateHoliday.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateHoliday.pending, (state) => {
      state.status = "pending";
    });

    // remove holiday
    builder.addCase(removeHoliday.fulfilled, (state, action) => {
      const { meta } = action;
      state.get_holidays = {
        ...state.get_holidays,
        data: state.get_holidays.data.filter(
          (item) => item.id !== meta.arg.values.id
        ),
      };
      state.status = "success";
    });
    builder.addCase(removeHoliday.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(removeHoliday.pending, (state) => {
      state.status = "pending";
    });

    // create custom user
    builder.addCase(createCustomUser.fulfilled, (state, action) => {
      state.addUpdateUser = action.payload;
      state.status = "success";
    });
    builder.addCase(createCustomUser.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(createCustomUser.pending, (state) => {
      state.status = "pending";
    });

    // get user by id
    builder.addCase(getCustomUserById.fulfilled, (state, action) => {
      state.getUserDataById = action.payload;
      state.status = "success";
    });
    builder.addCase(getCustomUserById.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getCustomUserById.pending, (state) => {
      state.status = "pending";
    });

    // update custom user
    builder.addCase(updateCustomUser.fulfilled, (state, action) => {
      state.addUpdateUser = action.payload;
      state.status = "success";
    });
    builder.addCase(updateCustomUser.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(updateCustomUser.pending, (state) => {
      state.status = "pending";
    });

    // get client/custom users list
    builder.addCase(getClientUsersList.fulfilled, (state, action) => {
      state.clientUsers = action.payload;
      state.status = "success";
    });
    builder.addCase(getClientUsersList.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getClientUsersList.pending, (state) => {
      state.status = "pending";
    });

    // get client/custom user by id
    builder.addCase(getClientUserbyId.fulfilled, (state, action) => {
      state.clientUserById = action.payload;
      state.status = "success";
    });
    builder.addCase(getClientUserbyId.rejected, (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    });
    builder.addCase(getClientUserbyId.pending, (state) => {
      state.status = "pending";
    });

    // Custom Order Placed
    builder.addCase(getCustomUsers.fulfilled, (state, action) => {
      state.customUsers = action.payload;
      state.status = "success";
    });
    builder.addCase(getCustomUsers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getCustomUsers.pending, (state) => {
      state.status = "pending";
    });

    // resend email
    builder.addCase(resendMail.fulfilled, (state, action) => {
      const {payload} = action;
      toast.success(payload.message)
      state.status = "success";
    });
    builder.addCase(resendMail.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(resendMail.pending, (state) => {
      state.status = "pending";
    });
  },
});

export const { removeMessage, focusElement, removeUserList, clearUserErrors } =
  userSlice.actions;
export default userSlice.reducer;
