const ORDER_STATUS = {
  in_progress: "In Progress",
  cancel: "Cancel",
  complete: "Complete",
};
const ORDER_STATUS_CLASS = {
  in_progress: "status_inprogress",
  under_review: "status_inprogress",
  cancelled: "status_cancel",
  complete: "status_success",
  approved: "status_success",
  rejected: "status_cancel",
  created: "status_success",
  paid:"status_success",
  not_created:"status_cancel"
};

const HOLIDAY_STATUS_CLASS = {
  cancelled: "status_cancel",
  confirmed: "status_success",
};

const JOB_STATUS = {
  1: "Register",
  2: "Logged In",
  3: "Logout",
  4: "Trial Eligible",
  5: "Trial Used",
  6: "Trial Not Eligible",
  7: "In Process",
  8: "Complete",
  9: "Active",
  10: "Inactive",
  11: "Paid",
  12: "Cancel",
  13: "Replaced",
};

const JOB_STATUS_CLASS = {
  7: "status_inprogress",
  8: "status_success",
  12: "status_cancel",
};

export {
  ORDER_STATUS,
  ORDER_STATUS_CLASS,
  JOB_STATUS,
  JOB_STATUS_CLASS,
  HOLIDAY_STATUS_CLASS,
};
