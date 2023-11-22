import Button from "components/Button";
import SelectBox from "components/SelectBox/SelectBox";
import Input from "components/inputField";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import countryList from "react-select-country-list";
import { toast } from "react-toastify";
import {
  getCardDetails,
  getbillingAddress,
  updatePaymentAddress,
} from "redux/asyncApi/paymentApi";
import { validationMsg } from "util/validationErrors";

const UpdateBillingAddress = ({ handleClose, address }) => {
  const [formData, setFormData] = useState({
    address1: address?.line1 ?? "",
    address2: address?.line2 ?? "",
    state: address?.state ?? "",
    city: address?.city ?? "",
    postal_code: address?.postal_code ?? "",
    country:address?.country? countryList()?.getValue(address?.country) : "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);

  const options = useMemo(() => countryList().getData(), []);
  const { address1, address2, state, city, postal_code, country } = formData;

  const dispatch = useDispatch();
  const onSubmitHandler = (event) => {
    event.preventDefault();
    setFormErrors(validateForm(formData));
  };
  useEffect(() => {
    if (isSubmit) {
      const values = {
        address1,
        address2,
        state,
        city,
        postal_code,
        country: countryList().getLabel(country) || country,
      };
      dispatch(updatePaymentAddress({ token, values })).then(({ payload }) => {
        if (payload.status) {
          toast.success(payload.message);
          handleClose();
          dispatch(getbillingAddress(token));
          dispatch(getCardDetails(token));
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);
  const address1Ref = useRef();
  const address2Ref = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const zipCodeRef = useRef();
  const countryRef = useRef();

  const validateForm = (values) => {
    const errors = {};
    if (values.country === "") {
      errors.country = validationMsg.countryReq;
      countryRef?.current.focus();
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
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
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
    <form onSubmit={onSubmitHandler} className="payment_form">
      <Row>
        <Col md={6}>
          <Input
            name="address1"
            type="text"
            autoComplete=""
            label="Address 1"
            required={false}
            value={address1}
            ref={address1Ref}
            onInputChange={onInputChange}
            ErrorLabel={formErrors.address1 ? "Address1_Error" : "Address1"}
            forLabel={"address1"}
            error={formErrors.address1 ? true : false}
            errorMsg={formErrors.address1}
          />
        </Col>
        <Col md={6}>
          <Input
            name="address2"
            type="text"
            autoComplete=""
            label="Address 2"
            required={false}
            value={address2}
            ref={address2Ref}
            onInputChange={onInputChange}
            ErrorLabel={formErrors.address2 ? "Address2_Error" : "Address2"}
            forLabel={"address2"}
            error={formErrors.address2 ? true : false}
            errorMsg={formErrors.address2}
          />
        </Col>
        <Col md={6}>
          <Input
            name="state"
            type="text"
            autoComplete=""
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
            autoComplete=""
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
            autoComplete=""
            label="Zip Code"
            required={false}
            value={postal_code}
            ref={zipCodeRef}
            onInputChange={onInputChange}
            ErrorLabel={formErrors.postal_code ? "Zip_code_Error" : "Zip_code"}
            forLabel={"postal_code"}
            error={formErrors.postal_code ? true : false}
            errorMsg={formErrors.postal_code}
          />
        </Col>
        <Col md={6}>
          <SelectBox
            className="form-control form-select"
            onChange={onInputChange}
            name="country"
            ref={countryRef}
            value={country}
            options={options}
            label={"Country (Optional):"}
            forLabel={"Country_Name"}
            ErrorLabel={formErrors.country ? "Zip_code_Error" : "Zip_code"}
            error={formErrors.country ? true : false}
            errorMsg={formErrors.country}
          />
        </Col>
      </Row>
      <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
        <Button
          title={"Cancel"}
          className={"button--border me-2"}
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
        />
        <Button
          title={"Update Address"}
          className={"button--blue"}
          type="submit"
        />
      </div>
    </form>
  );
};

export default UpdateBillingAddress;
