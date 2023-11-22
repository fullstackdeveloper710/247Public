import _ from "lodash";

export const currencyType = "$";
export const currencyFormatter = (number) => {
  if (number||number===0||number==="0") {
    return new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format(number);
  } else {
    return "N/A";
  }
};

export const usersTypes = {
  companyUser: "company_user",
  user: "user",
  admin: "admin",
  superAdmin: "super_admin",
  rootAdmin: "root_admin",
  postpaidRoot: "post_paid_root",
  postpaidUser: "post_paid_user",
  postpaidAdmin: "post_paid_admin",
  billingAdmin:"billing_admin"
};

const {
  companyUser,
  user,
  admin,
  superAdmin,
  rootAdmin,
  postpaidRoot,
  postpaidAdmin,
  postpaidUser,
  billingAdmin
} = usersTypes;

//These roles are for super-admin users
export const superAdminRoles = [superAdmin];

//These roles are for all types of users
export const allRoles = [
  companyUser,
  user,
  admin,
  rootAdmin,
  postpaidRoot,
  superAdmin,
  postpaidAdmin,
  postpaidUser,
  billingAdmin,
];

//These roles are for pay-as-you , root-admin , postpaid-root-admin users
export const primaryRoles = [billingAdmin,user, rootAdmin, postpaidRoot];

//These roles are for admin, root-admin ,postpaid-root-admin,super-admin users
export const secondaryRoles = [
  admin,
  rootAdmin,
  postpaidRoot,
  superAdmin,
  postpaidAdmin,
  billingAdmin,
];

//These roles are for approvals users
export const rolesForApproval = [postpaidRoot, rootAdmin,billingAdmin];

export const notAvailable = "N/A";
export const noRecordFound = "No Record Found";

// email validation
let regex = new RegExp("[a-z0-9]+@[admin]+.com$");

//date format
export const dateFormat = "MMM DD YYYY";

// without special characters validation
let regexSpecialchar = new RegExp("^[a-zA-Z]+$");

// Email Validation with Case Insensitivity:
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailRegex =
  /\b[A-Za-z0-9._%+-]+@(?:gmail|hotmail|yahoo|live|ymail|msn|test|icloud|rediffmail)\.(?:com|net|org)\b/;

//password validation
let passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//number regax for allowed upto two decimal numbers
export const numberRegexp = /^[0-9]*(\.[0-9]{0,2})?$/;

export const removeUnderScore = (string) => {
  return string.replace(/_/g, " ");
};

export const getFirstAndLast = (string1, string2) => {
  return string1?.[0] + string2?.[0];
};

export const basicEmailValidation = (address) => {
  return emailRegex.test(address);
};

export const passwordValidation = (address) => {
  return passwordRegex.test(address);
};

export const emailValidation = (address) => {
  return regex.test(address);
};

export const nameValidation = (address) => {
  return regexSpecialchar.test(address);
};

// get base 64 image
export const getBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};

export const bytesToSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0KB";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `(${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(0)} ${sizes[i]}`;
};

export const planList = [
  {
    id: "1",
    type: "Free",
  },
  {
    id: "2",
    type: "Premium",
  },
  {
    id: "3",
    type: "Enterprise",
  },
  {
    id: "4",
    type: "Postpaid",
  },
];

export const planTypes = {
  Free: 1,
  Premium: 2,
  Enterprise: 3,
  Postpaid: 4,
};

//This function is used for manuplate redux state value
export const filtredData = (array, payload) => {
  return array?.map((item) => {
    if (+item.id === +payload?.data?.id) {
      return {
        ...item,
        ...payload.data,
      };
    } else {
      return item;
    }
  });
};

export const subscriptionStatus = {
  active: "active",
  expired: "expired",
  authentication_required: "authentication_required",
  incomplete_expired: "incomplete_expired",
};

export const removeSubString = (inputString, from) => {
  var resultString = inputString.substring(inputString.indexOf(from) + 1);
  return resultString;
};

export  const rangePagination = (totalPage, page, limit, sibling) => {
  let totalPageNoInArray = 7 + sibling;

  if (totalPageNoInArray >= totalPage) {
    return _.range(1, totalPage + 1);
  }

  let leftSibllingIndex = Math.max(page - sibling, 1);
  let rigtSibllingIndex = Math.min(page + sibling, totalPage);

  let showLeftDots = leftSibllingIndex > 2;
  let showRightDots = rigtSibllingIndex < totalPage - 2;
  if (!showLeftDots && showRightDots) {
    let leftItemsCount = 3 + 2 * sibling;
    let leftRange = _.range(1, leftItemsCount + 1);
    return [...leftRange, "...", totalPage];
  } else if (showLeftDots && !showRightDots) {
    let rightItemsCount = 3 + 2 * sibling;
    let rightRange = _.range(totalPage - rightItemsCount + 1, totalPage + 1);
    return [1, "...", ...rightRange];
  } else {
    let middleRange = _.range(leftSibllingIndex, rigtSibllingIndex + 1);
    return [1, "...", ...middleRange, "...", totalPage];
  }
};
