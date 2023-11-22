import { toast } from "react-toastify";
import { message } from "util/message";

export const handleErrors = (error) => {
  if (error.response.status === 500) {
    toast.error(message.somethingWentWrong);
  }else if (error.response.status === 413) {
    toast.error(message.largeFile);
  }else if (error?.response?.status === 401) {
    toast.warning(message.somethingWentWrong);
  } else{
    toast.error(error?.response?.data?.message)
  }
};
