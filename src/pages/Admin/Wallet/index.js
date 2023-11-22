import { useStripe } from "@stripe/react-stripe-js";
import { textdot, visaicon } from "assets/images";
import Button from "components/Button";
import Input from "components/inputField";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  rechargeWallet,
  walletRechargeRetrive,
} from "redux/asyncApi/paymentApi";
import WalletPaymentCard from "stripe/WalletPaymentCard";
import { currencyFormatter, numberRegexp, usersTypes } from "util/helpers";
import { message } from "util/message";
import { validationMsg } from "util/validationErrors";

const RechargeWallet = ({
  handleCloseWallet,
  card_details,
  wallet_balance,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("savedCard");
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { amount } = formData; // destructured values

  //redux state
  const {
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app) || {};

  //redux action dispatcher
  const dispatch = useDispatch();

  // from stripe
  const stripe = useStripe();

  // user roles
  const { user } = usersTypes;

  //ref
  const amountRef = useRef();

  //methods
  useEffect(() => {
    if (!card_details) {
      setPaymentMethod("newCard");
    }
    if (isSubmit) {
      const values = {
        amount: amount,
        recharge_type: "existing_card",
      };
      dispatch(rechargeWallet({ token, values })).then(async ({ payload }) => {
        if (
          payload.response.status === "requires_action" &&
          payload.response.next_action.type === "use_stripe_sdk"
        ) {
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            payload.response.client_secret
          );
          const values = {
            payment_status: paymentIntent.status,
            paymentintent_id: paymentIntent.id,
          };
          if (!error) {
            switch (paymentIntent.status) {
              case "succeeded":
                dispatch(walletRechargeRetrive({ token, values })).then(
                  ({ payload }) => {
                    if (payload.status) {
                      handleCloseWallet();
                      toast.success(message.paymentSucceed);
                    }
                  }
                );
                break;
              case "processing":
                toast.info(message.paymentUnderProccess);
                dispatch(walletRechargeRetrive({ token, values }));
                break;
              case "requires_payment_method":
                toast.error(message.paymentRejected);
                dispatch(walletRechargeRetrive({ token, values }));
                break;
              default:
                toast.error(message.somethingWentWrong);
                break;
            }
          } else {
            toast.error(message.paymentfailed);
            setPaymentError(payload.message);
            setPaymentSuccess(false);
          }
        } else {
          if (payload.status) {
            toast.success(payload.message);
          } else {
            setPaymentError(message.anErrorOccured);
            setPaymentSuccess(false);
          }
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validateForm = (values) => {
    const errors = {};
    if (values.amount === "") {
      errors.amount = validationMsg.reqAmount;
      amountRef.current.focus();
    }

    if (!numberRegexp.test(values.amount) || values.amount <= 0) {
      errors.amount = validationMsg.validAmount;
      amountRef.current.focus();
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
  };

  return (
    <div>
      <p className="avail_amt">
        Current Balance : <span>{currencyFormatter(wallet_balance)}</span>
      </p>
      <Row>
        <Col md="12">
          <Input
            type="number"
            autoComplete="off"
            label="Amount:"
            required={false}
            ref={amountRef}
            ErrorLabel={formErrors.amount ? "Ammount_Error" : null}
            forLabel={"Ammount"}
            name="amount"
            value={amount}
            error={formErrors.amount ? true : false}
            errorMsg={formErrors.amount}
            onInputChange={onInputChange}
            min="1"
            step="0.01"
            placeholder="0.00"
          />
        </Col>
      </Row>
      {role !== user && (
        <div className="radioButtonGroup d-flex align-items-start">
          <div className="customCheckbox radioButton">
            <input
              type="radio"
              id="savedCard"
              name="recharge-wallet"
              checked={paymentMethod === "savedCard" && true}
              onChange={(e) => setPaymentMethod(e.target.id)}
            />
            <label htmlFor="savedCard">Existing Card</label>
          </div>

          <div className="customCheckbox radioButton ms-4">
            <input
              type="radio"
              id="newCard"
              name="recharge-wallet"
              checked={paymentMethod === "newCard" && true}
              onChange={(e) => {
                setPaymentMethod(e.target.id);
              }}
            />
            <label htmlFor="newCard">New Card</label>
          </div>
        </div>
      )}

      {paymentMethod === "savedCard" && role !== user ? (
        <div className="paymentDetails__descrp">
          <div className="paymentinner">
            {card_details ? (
              <>
                <span>
                  <img src={visaicon} alt="visaicon" />
                </span>
                <span>
                  <img src={textdot} alt="textdot" />
                </span>
                &nbsp;
                <span>{card_details?.last4}</span>
              </>
            ) : (
              <span>No existing card available</span>
            )}
          </div>
          {paymentError && (
            <div role="status" className="text-danger text-center">
              Error: {paymentError}
            </div>
          )}
          {paymentSuccess && (
            <div className="text-success text-center">Payment successful!</div>
          )}
          <div className="modalButtons w-100 d-flex justify-content-between">
            <Button
              title={"Cancel"}
              className={"button--border"}
              onClick={handleCloseWallet}
            />
            <Button
              disabled={!card_details}
              title={"Pay"}
              className={"button--blue ms-3"}
              onClick={onSubmitHandler}
            />
          </div>
        </div>
      ) : (
        <WalletPaymentCard
          handleClose={handleCloseWallet}
          amount={amount}
          setFormErrors={setFormErrors}
          amountRef={amountRef}
          formErrors={formErrors}
        />
      )}
    </div>
  );
};

export default RechargeWallet;
