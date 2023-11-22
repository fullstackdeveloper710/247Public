import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "react-bootstrap";
import Button from "components/Button";
import {
  getCardDetails,
  getbillingAddress,
  updateCardDetails,
} from "redux/asyncApi/paymentApi";
import { toast } from "react-toastify";
import { useState } from "react";
import StripeCardForm from "./StripeCardForm";
import { cardValidator } from "./stripeMethods";
import "./payment.scss";
import { message } from "util/message";

const UpdateCard = ({ handleClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    updateCardHandler();
  };

  const updateCardHandler = async () => {
    if (!stripe || !elements) {
      return;
    } else {

      //stripe card elements
      const cardElement = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);

      //stripe token
      const stripeToken = await stripe.createToken(cardElement);

      // stripe validations
      const isNumberEmpty = cardElement._empty;
      const isNumberInvalid = cardElement._invalid;
      const isExpiryEmpty = cardExpiry._empty;
      const isExpiryInvalid = cardExpiry._invalid;
      const isCvcEmpty = cardCvc._empty;
      const isCvcInvalid = cardCvc._invalid;

      //card validation function
      const errors = cardValidator(
        isNumberEmpty,
        isNumberInvalid,
        isExpiryEmpty,
        isExpiryInvalid,
        isCvcEmpty,
        isCvcInvalid
      );
      if (!errors) {
        setPaymentError();
        const values = {
          stripe_token: stripeToken.token.id,
        };
        dispatch(updateCardDetails({ token, values })).then(({ payload }) => {
          if (payload.status) {
            toast.success(payload.message);
            handleClose();
            dispatch(getCardDetails(token));
            dispatch(getbillingAddress(token));
          }
        });
      } else {
        setFormErrors(() => {
          return {
            ...errors,
          };
        });
        setPaymentError(message.anErrorOccured);
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
          title={"Update Card"}
          className={"button--blue"}
          type="submit"
          disabled={!stripe}
        />
      </div>
    </form>
  );
};

export default UpdateCard;
