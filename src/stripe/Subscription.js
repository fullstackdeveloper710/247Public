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
import {
  getCardDetails,
  getbillingAddress,
  stripeSubscription,
  updateWallet,
} from "redux/asyncApi/paymentApi";
import SelectBox from "components/SelectBox/SelectBox";
import countryList from "react-select-country-list";
import { toast } from "react-toastify";
import { reset } from "redux/Slices/appSlice";
import StripeCardForm from "./StripeCardForm";
import { message, stripeActionCases } from "util/message";
import { cardValidator } from "./stripeMethods";
import { validationMsg } from "util/validationErrors";
import "./payment.scss";

const Subscription = ({ handleBack, address, planId }) => {
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    address1: address?.line1 ?? "",
    address2: address?.line2 ?? "",
    state: address?.state ?? "",
    city: address?.city ?? "",
    postal_code: address?.postal_code ?? "",
    country: address?.country ?? "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  //Destructring values
  const { address1, address2, state, city, postal_code, country } = formData;
  const { cardNumber, cardExpiry, cardCvc } = formErrors;

  //Redux state
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);
  const { data, error } = useSelector((state) => state.payment);

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Stripe functions
  const stripe = useStripe();
  const elements = useElements();

  //Options get country list for country selectbox
  const options = useMemo(() => countryList().getData(), []);

  //Ref
  const address1Ref = useRef();
  const address2Ref = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const zipCodeRef = useRef();
  const countryRef = useRef();

  //Create card element
  const card = elements?.getElement(CardNumberElement);

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
      onSubscriptionHandler(values);
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
      if (cardExpiry) {
        errors.cardExpiry = cardExpiry;
      }
      if (cardCvc) {
        errors.cardCvc = cardCvc;
      }
      if (card && card._empty) {
        errors.cardNumber = "please enter card number";
      }
    }

    console.log(errors, "error");
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

  const onInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubscriptionHandler = async (address) => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    try {
      const stripeToken = await stripe.createToken(cardElement);
      const values = {
        stripe_token: stripeToken.token.id,
        plan_id: planId,
        ...address,
      };
      dispatch(stripeSubscription({ values, token })).then(
        async ({ payload }) => {
          if (payload.response.status === "requires_action") {
            const { paymentIntent, error } = await stripe.confirmCardPayment(
              payload.response.client_secret
            );
            if (!error) {
              switch (paymentIntent.status) {
                case stripeActionCases.succeeded:
                  toast.success(message.paymentSucceed);
                  setPaymentSuccess(true);
                  setPaymentError(null);
                  dispatch(getCardDetails(token));
                  dispatch(getbillingAddress(token));
                  dispatch(
                    updateWallet({
                      token,
                      values: { status: paymentIntent.status },
                    })
                  ).then(({ payload }) => {
                    if (payload.status) {
                      dispatch(reset(message.updateSubsSuccess));
                    }
                  });

                  break;
                case stripeActionCases.processing:
                  toast.info(message.paymentUnderProccess);
                  dispatch(
                    updateWallet({
                      token,
                      values: { status: paymentIntent.status },
                    })
                  );
                  break;
                case stripeActionCases.requires_payment_method:
                  toast.error(message.paymentRejected);
                  dispatch(
                    updateWallet({
                      token,
                      values: { status: paymentIntent.status },
                    })
                  );
                  break;
                default:
                  toast.error(message.somethingWentWrong);
                  dispatch(
                    updateWallet({
                      token,
                      values: { status: paymentIntent.status },
                    })
                  );
                  break;
              }
            } else {
              toast.error(message.paymentfailed);
              dispatch(
                updateWallet({
                  token,
                  values: { status: error.code },
                })
              );
            }
          } else {
            if (payload.status) {
              setPaymentSuccess(true);
              setPaymentError(null);
              dispatch(getCardDetails(token));
              dispatch(getbillingAddress(token));
              dispatch(reset(message.updateSubsSuccess));
            } else {
              setPaymentError(message.anErrorOccured);
              setPaymentSuccess(false);
            }
          }
        }
      );
    } catch (error) {
      setPaymentError(message.anErrorOccured);
      setPaymentSuccess(false);
    }
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
              </Col>{" "}
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
              </Col>
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

export default Subscription;
