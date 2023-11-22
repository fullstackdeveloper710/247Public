import { message } from "util/message";

export const cardValidator = (
  isNumberEmpty,
  isNumberInvalid,
  isExpiryEmpty,
  isExpiryInvalid,
  isCvcEmpty,
  isCvcInvalid
) => {
  let errors = {};
  if (isNumberEmpty || isNumberInvalid) {
    errors.cardNumberError = message.cardNumberError;
  }
  if (isExpiryEmpty || isExpiryInvalid) {
    errors.cardExpiryError = message.cardExpiryError;
  }
  if (isCvcEmpty || isCvcInvalid) {
    errors.cardCvcError = message.cardCvcError;
  }
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return errors;
};
