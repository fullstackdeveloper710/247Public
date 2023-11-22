import Button from "components/Button";
import ConfirmPopUp from "components/Confirm/ConfirmPopUp";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { renewSubscriptionPlan } from "redux/asyncApi/paymentApi";
import { useStripe } from "@stripe/react-stripe-js";
import { message, stripeActionCases } from "util/message";
import { toast } from "react-toastify";
import { reset } from "redux/Slices/appSlice";

const RenewSubscription = ({ btnTitle, confirmMsg, auth }) => {
  const [show, setShow] = useState(false);
  const {
    userAuth: {
      token,
      user: { is_subscribe },
    },
  } = useSelector((state) => state.app);

  const stripe = useStripe();
  const dispatch = useDispatch();

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const renewSubscriptionHandler = () => {
    dispatch(renewSubscriptionPlan({ token })).then(async ({ payload }) => {
      if (
        payload.response.status === "requires_action" &&
        payload.response.next_action.type === "use_stripe_sdk"
      ) {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          payload.response.client_secret
        );
        if (!error) {
          switch (paymentIntent.status) {
            case stripeActionCases.succeeded:
              toast.success(
                auth ? message.subsAuthSuccess : message.subsRenewSuccess
              );
              break;
            case stripeActionCases.processing:
              toast.info(
                auth
                  ? message.subsAuthUnderProccess
                  : message.subsRenewUnderProccess
              );
              break;
            case stripeActionCases.requires_payment_method:
              toast.error(
                auth ? message.subsAuthRequiresAction : message.subsRenewAction
              );
              break;
            default:
              toast.error(message.somethingWentWrong);
              break;
          }
        } else {
          toast.error(auth ? message.subsAuthFailed : message.subsRenewFailed);
        }
      } else {
        if (payload.status) {
          dispatch(
            reset(auth ? message.subsAuthSuccess : message.subsRenewSuccess)
          );
        } else {
          toast.error(auth ? message.subsAuthFailed : message.subsRenewFailed);
        }
      }
    });
  };

  const onConfirmHandler = () => {
    renewSubscriptionHandler();
  };
  return (
    <div className="renewSubscription">
      <Button
        title={btnTitle}
        className={"button--blue"}
        onClick={handleShow}
      />
      {/* <h3>or</h3> */}
      <ConfirmPopUp
        // Icon={Trash3}
        heading={"confirmation"}
        confirmMsg={confirmMsg}
        show={show}
        handleClose={handleClose}
        onConfirmHandler={onConfirmHandler}
      />
    </div>
  );
};

export default RenewSubscription;
