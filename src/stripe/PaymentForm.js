import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useEffect, useMemo, useRef, useState } from "react";
import Input from "components/inputField";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import Button from "components/Button";
import { stripeAuthPayment, stripePayment } from "redux/asyncApi/paymentApi";
import { toast } from "react-toastify";
import { getUsedMemory } from "redux/asyncApi/appApi";
import { orderInProcess } from "redux/asyncApi/orderApi";
import SelectBox from "components/SelectBox/SelectBox";
import countryList from "react-select-country-list";
import StripeCardForm from "./StripeCardForm";
import { cardValidator } from "./stripeMethods";
import { message } from "util/message";
import { validationMsg } from "util/validationErrors";
import "./payment.scss";
const PaymentForm = ({
  handleBack,
  amount,
  handleNext,
  address,
  order_temp_id,
}) => {
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    state: "",
    city: "",
    postal_code: "",
    country: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  //Redux state
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Ref
  const address1Ref = useRef();
  const address2Ref = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const zipCodeRef = useRef();
  const countryRef = useRef();

  //Stripe functions
  const stripe = useStripe();
  const elements = useElements();

  //Options get country list for country selectbox
  const options = useMemo(() => countryList().getData(), []);

  //Destructring values
  const { address1, address2, state, city, postal_code, country } = formData;

  //Methods
  useEffect(() => {
    if (isSubmit) {
      const values = {
        address1,
        address2,
        state,
        city,
        postal_code,
        country: countryList().getLabel(formData.country) || formData.country,
      };
      makePaymentHandler(values);
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const validateForm = (values) => {
    const errors = {};
    if (!address) {
      if (values.country === "") {
        errors.country = validationMsg.countryReq;
        countryRef?.current?.focus();
      }
      if (values.postal_code === "") {
        errors.postal_code = validationMsg.postalReq;
        zipCodeRef?.current.focus();
      }
      if (values.city === "") {
        errors.city = validationMsg.cityReq;
        cityRef?.current.focus();
      }
      if (values.state === "") {
        errors.state = validationMsg.stateReq;
        stateRef?.current.focus();
      }
      if (values.address2 === "") {
        errors.address2 = validationMsg.address2Req;
        address2Ref?.current.focus();
      }
      if (values.address1 === "") {
        errors.address1 = validationMsg.address1Req;
        address1Ref?.current.focus();
      }
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const cardElement = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);
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
    if (errors) {
      setIsSubmit(true);
      setFormErrors(errors);
      setPaymentError(message.anErrorOccured);
    } else {
      setPaymentError();
      setFormErrors(validateForm(formData));
    }
  };

  const makePaymentHandler = async (billingAddress) => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    try {
      const stripeToken = await stripe.createToken(cardElement);
      const values = {
        amount: amount, // Set the desired amount in cents
        currency: "usd",
        stripe_token: stripeToken.token.id,
        order_temp_id: order_temp_id,
        ...billingAddress,
      };
      if (address) {
        delete values.address1;
        delete values.address2;
        delete values.state;
        delete values.city;
        delete values.postal_code;
        delete values.country;
      }
      dispatch(stripePayment({ values, token })).then(async ({ payload }) => {
        if (
          payload.response.status === "requires_action" &&
          payload.response.next_action.type === "use_stripe_sdk"
        ) {
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            payload.response.client_secret
          );
          const values = {
            charge: paymentIntent,
            order_temp_id: order_temp_id,
          };
          if (!error) {
            switch (paymentIntent.status) {
              case "succeeded":
                setPaymentSuccess(true);
                setPaymentError(null);
                dispatch(stripeAuthPayment({ token, values })).then(
                  ({ payload }) => {
                    if (payload.status) {
                      toast.success(payload.message);
                      handleNext();
                      dispatch(getUsedMemory(token));
                      dispatch(orderInProcess(token));
                    } else {
                      handleNext();
                      toast.info(message.sentInvoice);
                    }
                  }
                );
                break;
              case "processing":
                toast.info(message.paymentUnderProccess);
                dispatch(stripeAuthPayment({ token, values }));
                break;
              case "requires_payment_method":
                toast.error(message.paymentRejected);
                dispatch(stripeAuthPayment({ token, values }));
                break;
              default:
                toast.error(message.somethingWentWrong);
                dispatch(stripeAuthPayment({ token, values }));
                break;
            }
          } else {
            toast.error(message.paymentfailed);
          }
        } else {
          if (payload.status) {
            toast.success(payload.message);
            handleNext();
            setPaymentSuccess(true);
            setPaymentError(null);
            dispatch(getUsedMemory(token));
            dispatch(orderInProcess(token));
          } else {
            setPaymentError(payload.message);
            setPaymentSuccess(false);
          }
        }
      });
    } catch (error) {
      setPaymentError(message.anErrorOccured);
      setPaymentSuccess(false);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="payment_form">
        <Row>
          <StripeCardForm
            iconCols="col-sm-12"
            cardCols="col-sm-12 col-md-6 col-lg-6 col-xl-6"
            expiryCols="col-sm-12 col-md-6 col-lg-6 col-xl-6"
            cvcCols="col-sm-12 col-md-6 col-lg-6 col-xl-6"
            formErrors={formErrors}
            paymentError={paymentError}
            paymentSuccess={paymentSuccess}
          />
        </Row>

        <Row>
          {/* {type == "Subscription" && ( */}
          {!address && (
            <>
              <Col md={6}>
                <Input
                  name="address1"
                  type="text"
                  autoComplete="address-line1"
                  label="Address 1"
                  required={false}
                  value={address1}
                  ref={address1Ref}
                  onInputChange={onInputChange}
                  ErrorLabel={
                    formErrors.address1 ? "Address1_Error" : "Address1"
                  }
                  forLabel={"address1"}
                  error={formErrors.address1 ? true : false}
                  errorMsg={formErrors.address1}
                />
              </Col>
              <Col md={6}>
                <Input
                  name="address2"
                  type="text"
                  autoComplete="address-line2"
                  label="Address 2"
                  required={false}
                  value={address2}
                  ref={address2Ref}
                  onInputChange={onInputChange}
                  ErrorLabel={
                    formErrors.address2 ? "Address2_Error" : "Address2"
                  }
                  forLabel={"address2"}
                  error={formErrors.address2 ? true : false}
                  errorMsg={formErrors.address2}
                />
              </Col>
              <Col md={6}>
                <Input
                  name="state"
                  type="text"
                  autoComplete="state"
                  label="State"
                  required={false}
                  value={state}
                  ref={stateRef}
                  onInputChange={onInputChange}
                  ErrorLabel={formErrors.state ? "State_Error" : "State"}
                  forLabel={"state"}
                  error={formErrors.state ? true : false}
                  errorMsg={formErrors.state}
                />
              </Col>
              <Col md={6}>
                <Input
                  name="city"
                  type="text"
                  autoComplete="city"
                  label="City"
                  required={false}
                  value={city}
                  ref={cityRef}
                  onInputChange={onInputChange}
                  ErrorLabel={formErrors.city ? "City_Error" : "City"}
                  forLabel={"city"}
                  error={formErrors.city ? true : false}
                  errorMsg={formErrors.city}
                />
              </Col>{" "}
              <Col md={6}>
                <Input
                  name="postal_code"
                  type="text"
                  autoComplete="postal-code"
                  label="Zip Code"
                  required={false}
                  value={postal_code}
                  ref={zipCodeRef}
                  onInputChange={onInputChange}
                  ErrorLabel={
                    formErrors.postal_code ? "Zip_code_Error" : "Zip_code"
                  }
                  forLabel={"postal_code"}
                  error={formErrors.postal_code ? true : false}
                  errorMsg={formErrors.postal_code}
                />
              </Col>
              <Col md={6}>
                <SelectBox
                  className="form-control form-select"
                  autoComplete="country-name"
                  onChange={onInputChange}
                  name="country"
                  value={country}
                  options={options}
                  label={"Country (Optional):"}
                  forLabel={"Country_Name"}
                  ErrorLabel={
                    formErrors.country ? "Zip_code_Error" : "Zip_code"
                  }
                  error={formErrors.country ? true : false}
                  errorMsg={formErrors.country}
                />
              </Col>
            </>
          )}
          {/* )} */}
        </Row>
        <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
          <Button
            title={"Back"}
            className={"button--border"}
            onClick={() => handleBack()}
          />
          <Button
            title={"Make Payment"}
            className={"button--blue ms-3"}
            type="submit"
            disabled={!stripe}
          />
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
