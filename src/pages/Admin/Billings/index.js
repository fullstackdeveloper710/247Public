import { BILLINGS_TITLE } from "constants/title";
import React, { useEffect, useState } from "react";
import "./Billing.scss";
import { useDispatch, useSelector } from "react-redux";
import { planTypes, usersTypes } from "util/helpers";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getCardDetails, getbillingAddress } from "redux/asyncApi/paymentApi";
import BillingDetails from "./BillingDetails";
import SubscriptionPlans from "./SubscriptionPlans";
import { getWalletBalance } from "redux/asyncApi/appApi";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Billings = () => {
  document.title = BILLINGS_TITLE;
  const [showElements, setShowElements] = useState(false);
  const {
    userAuth: { token, user: UserDetails, UserSubscriptionPlan },
  } = useSelector((state) => state.app) || {};

  const { billingInfo, cardDetail } =
    useSelector((state) => state.payment) || {};
  const {
    result: { address },
  } = billingInfo || {};
  const { user, billingAdmin,postpaidRoot } = usersTypes;
  const dispatch = useDispatch();

  useEffect(()=>{
    if(UserDetails.role!==postpaidRoot){
      dispatch(getWalletBalance(token));
    }
  },[]);

  useEffect(() => {
    dispatch(getbillingAddress(token));
    if (UserDetails.role !== user) {
      dispatch(getCardDetails(token)).then(({ payload }) => {
        if (!payload.status) {
          setShowElements(true);
        } else {
          setShowElements(false);
        }
      });
    } else {
      setShowElements(true);
    }
  }, [UserDetails]);

  const { Free, Postpaid } = planTypes;
  const { plan_name } = UserSubscriptionPlan || {};

  return (
    <>
      {/* Add Plan */}
      <BillingDetails
        Free={Free}
        Postpaid={Postpaid}
        selectedPlan={plan_name}
        address={address}
        cardDetail={cardDetail}
        fullName={`${UserDetails?.first_name + " " + UserDetails?.last_name}`}
      />
      {/* Subscription plan */}
      {UserDetails?.role !== billingAdmin &&
        <Elements stripe={stripePromise}>
          <SubscriptionPlans showElements={showElements} />
        </Elements>}
    </>
  );
};

export default Billings;
