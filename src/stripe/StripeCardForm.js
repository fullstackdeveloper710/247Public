import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { CreditIcons } from "assets/images";
import CardIcons from "components/stripeComponents/CardIcons";
import React from "react";

const StripeCardForm = ({
  formErrors,
  paymentError,
  paymentSuccess,
  iconCols,
  cardCols,
  expiryCols,
  cvcCols,
}) => {

  //Destructring errors from formErrors prop
  const { cardNumberError, cardExpiryError, cardCvcError } = formErrors;

  //Card element style
  const style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  return (
    <>
      <div className={iconCols}>
        <CardIcons
          mainClass="inputRow"
          cardsContainerClass="paymentMethods mt-3"
          imgClass="img-fluid"
          imgSrc={CreditIcons}
        />
      </div>
      {paymentError && (
        <div
          role="alert"
          aria-live="polite"
          className="payment_error text-center"
        >
          <p tabIndex="-1"> Error: {paymentError}</p>
          <ol className="error_list">
            {cardNumberError && <li>{cardNumberError}</li>}
            {cardExpiryError && <li>{cardExpiryError}</li>}
            {cardCvcError && <li>{cardCvcError}</li>}
          </ol>
        </div>
      )}
      {paymentSuccess && (
        <div className="text-success text-center">Payment successful!</div>
      )}
      <div className={cardCols}>
        <label className="payment_element_label inputRow">
          Card Number:
          <CardNumberElement
            options={{ style: style, showIcon: true, iconStyle: "default" }}
            className="payment_input_feild"
          />
        </label>
      </div>
      <div className={expiryCols}>
        <label className="payment_element_label inputRow">
          Card Expiry:
          <CardExpiryElement
            options={{ style: style }}
            className="payment_input_feild"
          />
        </label>
      </div>
      <div className={cvcCols}>
        <label className="payment_element_label inputRow">
          Card cvc:
          <CardCvcElement
            options={{ style: style }}
            className="payment_input_feild"
          />
        </label>
      </div>
    </>
  );
};

export default StripeCardForm;
