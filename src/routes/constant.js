// route name ---------------------------------------------------------------
const SIGN_IN="/";
const REGISTER="/register";
const FORGET_PASSWORD="/forget-password";
const RESET_PASSWORD="/reset-password/:id"
const NOT_FOUND = "*"
const MANAGE_USERS = "/manage-users";
const ADD_NEW_USER = "/add-new-user";
const UPDATE_USER = "/update-user/:id";
const ADD_NEW_CUSTOM_USER = "/add-new-custom-user";
const UPDATE_CUSTOM_USER = "/update-custom-user/:id";
const ORDER_MANAGEMENT = "/order-management";
const ORDER_DETAILS = "/order-details";
const ORDER_DETAILS_BY_ID = "/order-details/:id";
const UPDATE = "/upload";
const PROFILE = "/profile";
const EDIT_PROFILE='/edit-profile'
const DASHBOARD = "/dashboard"
const BILLINGS = "/billings"
const MANAGE_HOLIDAYS = "/manage-holidays"
const WORKLOAD = "/workload"
const CLIENT_USERS="/Client-users"
const USERS_FILE_DETAILS = "/User-file-details/:id"
const CREATE_PASSWORD = "/create-password/:id"
const REGISTER_VERIFICATION = "/register-verification/:name"
const ERROR_PAGE= "/error-page/:error"
const DOCUMENT_DETAILS = "/document-details/:id"
const APPROVAL_LIST = "/approvals"
const ACCESSIBLE_INVOICE = "/accessible-invoice/:id"
const CLIENT_ORDER_MANAGEMENT = "/clients-order-management";
const CLIENT_INVOICE_DETAILS = "/invoice-details/:id"

export const ROUTES = {
  SIGN_IN,
  REGISTER,
  FORGET_PASSWORD,
  RESET_PASSWORD,
  NOT_FOUND,
  MANAGE_USERS,
  ADD_NEW_USER,
  UPDATE_USER,
  ORDER_MANAGEMENT,
  ORDER_DETAILS,
  ORDER_DETAILS_BY_ID,
  UPDATE,
  PROFILE,
  EDIT_PROFILE,
  DASHBOARD,
  BILLINGS,
  MANAGE_HOLIDAYS,
  WORKLOAD,
  CLIENT_USERS,
  USERS_FILE_DETAILS,
  CREATE_PASSWORD,
  REGISTER_VERIFICATION,
  ERROR_PAGE,
  DOCUMENT_DETAILS,
  APPROVAL_LIST,
  ADD_NEW_CUSTOM_USER,
  UPDATE_CUSTOM_USER,
  ACCESSIBLE_INVOICE,
  CLIENT_ORDER_MANAGEMENT,
  CLIENT_INVOICE_DETAILS
};

// title --------------------------------------------------------------------
const MANAGE_USERS_TITLE = "Manage Users";
const ADD_NEW_USER_TITLE = "Add New User";
const UPDATE_USER_TITLE = "Update User";
const ADD_NEW_CUSTOM_USER_TITLE = "Add New Custom User";
const UPDATE_CUSTOM_USER_TITLE = "Update Custom User";
const ORDER_MANAGEMENT_TITLE = "Order";
const ORDER_DETAILS_TITLE = "Order Details";
const UPDATE_TITLE = "Upload";
const PROFILE_TITLE = "Profile";
const EDIT_PROFILE_TITLE = "Edit Profile";
const MANAGE_HOLIDAYS_TITLE="Manage Holidays"
const WORKLOAD_TITLE = "Workload"
const CLIENT_USERS_TITLE = "Client Users"
const BILLINGS_TITLE="Billing"
const DASHBOARD_TITLE="Dashboard"
const USERS_FILE_DETAILS_TITLE = "User File Details"
const DOCUMENT_DETAILS_TITLE = "Document Information"
const APPROVAL_LIST_TITLE = "File Approval"
const ACCESSIBLE_INVOICE_TITLE = "Invoice"
const CLIENT_ORDER_MANAGEMENT_TITLE = "Clients Order"
const CLIENT_INVOICE_DETAILS_TITLE = "Invoice Detail"

export const TITLE = {
  MANAGE_USERS_TITLE,
  ADD_NEW_USER_TITLE,
  UPDATE_USER_TITLE,
  ORDER_MANAGEMENT_TITLE,
  ORDER_DETAILS_TITLE,
  UPDATE_TITLE,
  PROFILE_TITLE,
  EDIT_PROFILE_TITLE,
  MANAGE_HOLIDAYS_TITLE,
  WORKLOAD_TITLE,
  CLIENT_USERS_TITLE,
  BILLINGS_TITLE,
  DASHBOARD_TITLE,
  USERS_FILE_DETAILS_TITLE,
  DOCUMENT_DETAILS_TITLE,
  APPROVAL_LIST_TITLE,
  ADD_NEW_CUSTOM_USER_TITLE,
  UPDATE_CUSTOM_USER_TITLE,
  ACCESSIBLE_INVOICE_TITLE,
  CLIENT_ORDER_MANAGEMENT_TITLE,
  CLIENT_INVOICE_DETAILS_TITLE
};
