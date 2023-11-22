import { toast } from "react-toastify";
import { base_url } from "services/base_url";
import { handleErrors } from "services/handleErrors";
import axiosApiInstance from "services/interceptor";

const headers = {
  "Content-Type": "application/json",
};

const sign_in = async (data) => {
  return await axiosApiInstance.post(base_url + "login", data);
};

const sign_out = async (authToken) => {
  return await axiosApiInstance.post(base_url + "logout", null, {
    headers: {
      ...headers,
      Authorization: `Bearer ${authToken}`,
    },
  });
};

const register = async (data) => {
  return await axiosApiInstance.post(base_url + "register", data);
};

const forget_password = async (data) => {
  return await axiosApiInstance.post(base_url + "forget-password", data);
};

const reset_password = async (data) => {
  return await axiosApiInstance.post(base_url + "reset-password", data);
};

const create_password = async (data) => {
  return await axiosApiInstance.post(base_url + "create-password", data);
};

const get_master_data = async (type) => {
  return await axiosApiInstance.get(base_url + `master-data?type=${type}`);
};
// Auth Apis

const get_user_details = async (authToken) => {
  return await axiosApiInstance.get(base_url + `user/profile`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${authToken}`,
    },
  });
};

const update_user_details = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `user/update-profile`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const user_listing = async (token) => {
  return await axiosApiInstance.post(base_url + "get_users", null, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const workload_listing = async (token) => {
  return await axiosApiInstance.get(base_url + "get-all-files", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_workload_file = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "order-prosess", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const workload_listing_file = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.get(
    base_url +
      `get-files?file_id=${values.id}&user_id=${values.user_id}&order_id=${values.order_id}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const add_new_user = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "create_user", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_user = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "edit_user", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const getUserById = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "get_user_by_id", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const make_incative_user = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "inactive_user", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const make_is_admin = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "switch-user", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const orderListing = async (token) => {
  return await axiosApiInstance.get(base_url + "user/order-list", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const remove_file = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url +
      `deleteconfirmfile?id=${values.id}&order_temp_id=${values.order_temp_id}`,
    { user_id: values.user_id },
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const orderDetails = async (data) => {
  return await axiosApiInstance.post(base_url + "getjobsdetail", data);
};

const get_order_by_id = async (data) => {
  return await axiosApiInstance.post(base_url + "user/order-details", data, {
    headers: {
      ...headers,
      Authorization: `Bearer ${data.token}`,
    },
  });
};

const downloadPdf = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.get(
    base_url + `downloadfile?order_file_id=${values.id}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const download_report = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.get(
    base_url + `downloadreport?order_file_id=${values.id}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const download_all_pdf = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `downloadallfile?order_id=${values.id}`,
    null,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const download_all_report = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `downloadallreport?order_id=${values.id}`,
    null,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const order_in_process = async (token) => {
  return await axiosApiInstance.get(base_url + "user/order-inprocess", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const upload_files = async (data, onUploadProgress) => {
  const { token, values } = data;

  return await axiosApiInstance
    .post(base_url + "upload-file", values, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 1000 * 60 * 30,
      onUploadProgress: onUploadProgress,
    })
    .then((response) => response)
    .catch((error) => {
      handleErrors(error);
    });
};

const upload_invoice = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "send-mail", values, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_file_type_list = async (data) => {
  return await axiosApiInstance
    .post(base_url + "getfiletypelist", data, {})
    .then((response) => response)
    .catch((error) => console.log(error, "error on upload response"));
};

const get_braintree_token = async (token) => {
  return await axiosApiInstance.get(base_url + "generateToken", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const confirm_files = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "updateConfirmFiles", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const accessibility_files = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `save_accessibility?order_temp_id=${values?.order_temp_id}`,
    values,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const get_order_information = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `getOrderInformation?order_temp_id=${values?.order_temp_id}`,
    values,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const apply_coupon = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `applyDiscountCoupon?order_temp_id=${values.order_temp_id}`,
    values,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const make_payment = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `checkPayment`, values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_sla_type = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "updateSla", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_multiple_sla_type = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "updateMultipleSla", values, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const dashboard_data = async (data) => {
  return await axiosApiInstance.get(base_url + "user/yearly-data", {
    headers: {
      ...headers,
      Authorization: `Bearer ${data}`,
    },
  });
};

const chart_data = async (data) => {
  return await axiosApiInstance.get(base_url + "user/monthly-data", {
    headers: {
      ...headers,
      Authorization: `Bearer ${data}`,
    },
  });
};

const get_used_memory = async (token) => {
  return await axiosApiInstance.get(base_url + "memory", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const create_holiday = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + "create-holidays", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_holiday = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `update-holidays/${values.id}`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const get_holidays = async (token) => {
  return await axiosApiInstance.get(base_url + "get-holidays", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const remove_holiday = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.delete(base_url + `holidays/${values.id}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const stripe_subscription = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `stripe-subscription`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const stripe_payment = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `stripe-payment`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_billing_info = async (token) => {
  return await axiosApiInstance.get(base_url + `stripe-get-address`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_card_details = async (token) => {
  return await axiosApiInstance.get(base_url + `stripe-get-card-details`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_card_details = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `stripe-update-card`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_payment_address = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `stripe-update-address`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const order_placed = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `order-placed`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const custom_order_placed = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `custom-order-placed`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_approval_list = async (token) => {
  return await axiosApiInstance.get(base_url + `approval-requests`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// approve order
const approve_order = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `update-approval-request`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const get_custom_user_by_id = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.get(
    base_url + `get-custom-user?user_id=${values.user_id}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const create_custom_user = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `custom-user-create`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
const update_custom_user = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `custom-user-update?user_id=${values.user_id}`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const update_subscription = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `stripe-plan-update`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_wallet = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `stripe-walllet-update`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const stripe_auth_payment = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `authenticate-stripe-payment`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const get_custom_user_list = async (token) => {
  return await axiosApiInstance.get(base_url + `get-custom-user-list`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const recharge_wallet = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `recharge-wallet`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const wallet_recharge_retrive = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `recharge-retrive`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_client_users_list = async (token) => {
  return await axiosApiInstance.get(base_url + `all-custom-users`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_client_user_by_id = async (data) => {
  const { values, token } = data;
  return await axiosApiInstance.get(
    base_url + `custom-user-order?user_id=${values?.id}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const pay_with_wallet = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(base_url + `pay-by-wallet`, values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const subscription_change = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `subscription-change-wallet`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const pending_approvals_count = async (token) => {
  return await axiosApiInstance.get(base_url + "pending-request-count", {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_invoice = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.get(
    base_url + `invoice-details?invoice_number=${values?.invoice_number}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const renew_subscription_plan = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `renew-subscription-api`,
    null,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const get_clients_order_list = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `custom-order-list`,
    { user_id: values.selectedUserId },
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const generate_multiple_invoices = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.post(
    base_url + `generate-custom-order-invoices`,
    values,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const get_invoice_details = async (data) => {
  const { invoice_id, token } = data;
  return await axiosApiInstance.get(
    base_url + `custom-invoice-details/${invoice_id}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const update_invoice_status = async (data) => {
  const { object, token } = data;
  return await axiosApiInstance.post(
    base_url + "invoice-status-update",
    object,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const resend_email = async (data) => {
  const { values, token } = data;
  return await axiosApiInstance.post(base_url + "resend-email", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_user_role = async (data) => {
  const { token, values } = data;
  return await axiosApiInstance.get(base_url + `user/role`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_department_list = async (token) => {
  return await axiosApiInstance.get(base_url + `departments`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const add_department = async (data) => {
  const { values, token } = data;
  return await axiosApiInstance.post(base_url + "add-department", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const update_department = async (data) => {
  const { values, token } = data;
  return await axiosApiInstance.post(base_url + "edit-department", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_wallet_balance = async (token) => {
  return await axiosApiInstance.get(base_url + `get-wallet-balance`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_billing_detail = async (token) => {
  return await axiosApiInstance.get(base_url + `invoice-payment-status`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const get_postpaid_orders_count = async (token) => {
  return await axiosApiInstance.get(base_url + `postpaid-orders-count`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const send_user_contact_info = async (data) => {
  const { values } = data;
  return await axiosApiInstance.post(base_url + "contact-us-mail", values, {
    headers: {
      ...headers,
    },
  });
};

const update_password = async (data) => {
  const { values, token } = data;
  return await axiosApiInstance.post(base_url + "update-password", values, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const services = {
  workload_listing,
  user_listing,
  add_new_user,
  update_user,
  getUserById,
  make_incative_user,
  make_is_admin,
  orderListing,
  orderDetails,
  downloadPdf,
  download_report,
  download_all_pdf,
  download_all_report,
  order_in_process,
  get_order_by_id,
  upload_files,
  remove_file,
  get_file_type_list,
  get_braintree_token,
  confirm_files,
  accessibility_files,
  get_order_information,
  apply_coupon,
  make_payment,
  update_sla_type,
  update_multiple_sla_type,
  sign_in,
  register,
  get_user_details,
  update_user_details,
  forget_password,
  reset_password,
  create_password,
  dashboard_data,
  chart_data,
  sign_out,
  get_used_memory,
  workload_listing_file,
  update_workload_file,
  create_holiday,
  update_holiday,
  get_holidays,
  remove_holiday,
  upload_invoice,
  stripe_subscription,
  stripe_payment,
  get_billing_info,
  get_card_details,
  update_card_details,
  update_payment_address,
  order_placed,
  custom_order_placed,
  get_approval_list,
  approve_order,
  create_custom_user,
  update_custom_user,
  update_subscription,
  update_wallet,
  get_custom_user_by_id,
  stripe_auth_payment,
  get_custom_user_list,
  recharge_wallet,
  wallet_recharge_retrive,
  get_client_users_list,
  get_client_user_by_id,
  pay_with_wallet,
  subscription_change,
  pending_approvals_count,
  get_invoice,
  renew_subscription_plan,
  get_clients_order_list,
  generate_multiple_invoices,
  get_invoice_details,
  update_invoice_status,
  resend_email,
  get_user_role,
  get_department_list,
  add_department,
  update_department,
  get_wallet_balance,
  get_billing_detail,
  get_postpaid_orders_count,
  send_user_contact_info,
  update_password,
};
