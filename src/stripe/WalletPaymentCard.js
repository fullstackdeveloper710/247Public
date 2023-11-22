import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Button from "components/Button";
import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  rechargeWallet,
  walletRechargeRetrive,
} from "redux/asyncApi/paymentApi";
import { numberRegexp } from "util/helpers";
import { cardValidator } from "./stripeMethods";
import StripeCardForm from "./StripeCardForm";
import { message } from "util/message";
import { validationMsg } from "util/validationErrors";

const WalletPaymentCard = ({
  handleClose,
  amount,
  setFormErrors,
  amountRef,
  formErrors,
}) => {
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (amount === "") {
      setFormErrors((prev) => {
        return {
          ...prev,
          amount: validationMsg.reqAmount,
        };
      });
      amountRef?.current?.focus();
    } else if (!numberRegexp.test(amount) || amount <= 0) {
      setFormErrors((prev) => {
        return {
          ...prev,
          amount: validationMsg.validAmount,
        };
      });
      amountRef?.current?.focus();
    } else {
      rechargeWalletHandler();
    }
  };

  const rechargeWalletHandler = async () => {
    if (!stripe || !elements) {
      return;
    } else {
      const cardElement = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);

      try {
        const stripeToken = await stripe.createToken(cardElement);
        const isNumberEmpty = cardElement._empty;
        const isNumberInvalid = cardElement._invalid;
        const isExpiryEmpty = cardExpiry._empty;
        const isExpiryInvalid = cardExpiry._invalid;
        const isCvcEmpty = cardCvc._empty;
        const isCvcInvalid = cardCvc._invalid;

     
        const errors = cardValidator(
          isNumberEmpty,
          isNumberInvalid,
          isExpiryEmpty,
          isExpiryInvalid,
          isCvcEmpty,
          isCvcInvalid
        );
        if (!errors) {
          setFormErrors({});
          setPaymentError();
          const values = {
            amount: amount,
            currency: "usd",
            recharge_type: "new_card",
            stripe_token: stripeToken.token.id,
          };

          dispatch(rechargeWallet({ token, values })).then(
            async ({ payload }) => {
              if (
                payload.response.status === "requires_action" &&
                payload.response.next_action.type === "use_stripe_sdk"
              ) {
                const { paymentIntent, error } =
                  await stripe.confirmCardPayment(
                    payload.response.client_secret
                  );
                const values = {
                  payment_status: paymentIntent?.status,
                  paymentintent_id: paymentIntent?.id,
                };
                if (!error) {
                  switch (paymentIntent.status) {
                    case "succeeded":
                      dispatch(walletRechargeRetrive({ token, values })).then(
                        ({ payload }) => {
                          if (payload.status) {
                            handleClose();
                            toast.success("Payment done Successfully");
                          }
                        }
                      );
                      break;
                    case "processing":
                      toast.info(message.paymentUnderProccess);
                      dispatch(walletRechargeRetrive({ token, values }));
                      break;
                    case "requires_payment_method":
                      toast.error(
                        message.paymentRejected
                      );
                      dispatch(walletRechargeRetrive({ token, values }));
                      break;
                    default:
                      toast.error(message.somethingWentWrong);
                      break;
                  }
                } else {
                  toast.error(message.paymentfailed);
                }
              } else {
                if (payload.status) {
                  toast.success(payload.message);
                  setPaymentSuccess(true);
                  setPaymentError(null);
                } else {
                  setPaymentError(payload.message);
                  setPaymentSuccess(false);
                }
              }
            }
          );
        } else {
          setFormErrors(() => {
            return {
              ...errors,
            };
          });
          setPaymentError(
            message.anErrorOccured
          );
          const errorsEle = document.getElementById("errors_container");
          errorsEle?.focus();
        }
      } catch (error) {
        setPaymentError(message.anErrorOccured);
        setPaymentSuccess(false);
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="payment_form">
      <Row>
        <StripeCardForm
          iconCols="col-sm-12"
          cardCols="col-sm-12"
          expiryCols="col-sm-6"
          cvcCols="col-sm-6"
          formErrors={formErrors}
          paymentError={paymentError}
          paymentSuccess={paymentSuccess}
        />
      </Row>

      <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
        <Button
          title={"Cancel"}
          className={"button--border me-2"}
          onClick={handleClose}
        />
        <Button
          title={"Pay"}
          className={"button--blue"}
          type="submit"
          disabled={!stripe}
        />
      </div>
    </form>
  );
};

export default WalletPaymentCard;
