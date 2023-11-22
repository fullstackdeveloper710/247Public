import { bytesToSize } from "./helpers";

export const stripeActionCases = {
  succeeded: "succeeded",
  processing: "processing",
  requires_payment_method: "requires_payment_method",
};

export const message = {
  //stripe card vadidation
  cardNumberError: "Please enter a valid credit or debit card number.",
  cardExpiryError: "Please enter a valid credit or debit card expiry.",
  cardCvcError: "Please enter a valid credit or debit card CVC.",

  //key values
  internalServer: "Internal server error.",
  notFound: "Not found.",
  somethingWentWrong: "Something went wrong!",
  largeFile: "Too large file.",
  paymentfailed: "Payment failed.",
  anErrorOccured: "An error occurred during payment. Please try again.",
  paymentRejected: "Your payment was not successful. Please try again.",
  paymentUnderProccess: "Your payment is under processing.",
  updateSubForFeature: "Please upgrade your subscription for this feature.",
  commingSoonFeature:"Coming soon!",
  waitPrevFiles: "Please wait for uploading previous files.",
  sentInvoice: "We will send invoice on your email.",
  paymentSucceed: "Payment succeeded.",
  updateSubsSuccess:
    "Congratulations your subscription plan has been Upgraded. Please login again.",

  //subscription messages
  subsBuy: "Please complete plan subscription by entring credit card details.",

  //subscription authentication messages
  subsAuthSuccess:
    "Congratulations your subscription plan has been Authenticated now. Please login again.",
  subsAuthFailed: "Subscription authenticatation failed.",
  subsAuthUnderProccess: "Subscription authenticatation is in under process.",
  subsAuthRequiresAction: "Subscription authenticatation is not completed.",

  //subscription renew messages
  subsRenewSuccess:
    "Congratulations your subscription renewal is completed now. Please login again.",
  subsRenewFailed: "Subscription renewal failed.",
  subsRenewUnderProccess: "Subscription renewal is in under process.",
  subsRenewAction: "Subscription renewal is not completed.",

  //subscription popup messages
  subsAuthPopUp: "Are you sure to authenticate your subscription?",
  subsRenewPopUp: "Are you sure to renew your subscription?",
  resendMailPopUp:"Are you sure to resend email?",

  //functions
  fileLimitExceed: (maxLimitBinary) =>
    `limit exceed from ${bytesToSize(maxLimitBinary)}`,
  singleFileLimit: (fileName, fileLimit) =>
    `${fileName} file size should be less then ${bytesToSize(fileLimit)}`,
  notSupportedFile: (fileName) =>
    `${fileName} file type not supported. Please upload a PDF, Word or PPT file.`,

  subsAuthRequired: (plan) =>
    `Your authentication for subscription of ${plan} plan is currently pending.
     Please click authentication button to complete the payment for ${plan} plan subscription.`,
  subsExpired: (plan) =>
    `To renew your subscription of ${plan} plan authentication is needed.
     Please click authentication button to complete the payment for ${plan} plan subscription.`,
};
