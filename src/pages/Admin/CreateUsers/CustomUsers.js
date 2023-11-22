import React, { useEffect, useState, useRef, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "components/Button";
import Input from "components/inputField";
import { setItem } from "constants/localstorage";
import { ADD_NEW_CUSTOM_USER, UPDATE_CUSTOM_USER } from "constants/title";
import {
  createCustomUser,
  getCustomUserById,
  updateCustomUser,
} from "redux/asyncApi/userApi";
import {
  removeMessage,
  focusElement,
  clearUserErrors,
} from "redux/Slices/userSlice";
import "./createUser.scss";
import { ROUTES } from "routes/constant";
import SelectBox from "components/SelectBox/SelectBox";
import countryList from "react-select-country-list";
import PhoneInputComp from "components/inputField/PhoneInputComp";
import { validationMsg } from "util/validationErrors";
const CreateCustomUsers = () => {
  const firstNameRef = useRef(HTMLAllCollection);
  const lastNameRef = useRef(HTMLAllCollection);
  const emailRef = useRef(HTMLAllCollection);
  const addressRef = useRef(HTMLAllCollection);
  const address2Ref = useRef(HTMLAllCollection);
  const stateRef = useRef(HTMLAllCollection);
  const cityRef = useRef(HTMLAllCollection);
  const zipRef = useRef(HTMLAllCollection);
  const pdfRef = useRef(HTMLAllCollection);
  const docRef = useRef(HTMLAllCollection);
  const pptRef = useRef(HTMLAllCollection);
  const pdfFormRef = useRef(HTMLAllCollection);
  const expeditedPdfRef = useRef(HTMLAllCollection);
  const expeditedDocRef = useRef(HTMLAllCollection);
  const expeditedPptRef = useRef(HTMLAllCollection);
  const rushPdfRef = useRef(HTMLAllCollection);
  const rushDocRef = useRef(HTMLAllCollection);
  const rushPptRef = useRef(HTMLAllCollection);
  const compNameRef = useRef(HTMLAllCollection);
  const countryRef = useRef(HTMLAllCollection);
  const phoneRef = useRef(HTMLAllCollection);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addUpdateUser, error } = useSelector((state) => state?.user) || {};
  const { status: success, message } = addUpdateUser || {};
  const { data: UserDetails, status } =
    useSelector((state) => state.user?.getUserDataById) || {};
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [inputForm, setInputForm] = useState({
    firstName: "",
    lastName: "",
    userEmail: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    postal_code: "",
    normal_pdf_price: "",
    normal_doc_price: "",
    normal_ppt_price: "",
    pdf_form_price: "",
    compName: "",
    country: "",
    mobile_number: "",
    expedited_pdf_price: "",
    expedited_doc_price: "",
    expedited_ppt_price: "",
    rush_pdf_price: "",
    rush_doc_price: "",
    rush_ppt_price: "",
  });
  const {
    firstName,
    lastName,
    userEmail,
    address1,
    address2,
    state,
    city,
    postal_code,
    normal_pdf_price,
    normal_doc_price,
    normal_ppt_price,
    pdf_form_price,
    compName,
    country,
    mobile_number,
    expedited_pdf_price,
    expedited_doc_price,
    expedited_ppt_price,
    rush_pdf_price,
    rush_doc_price,
    rush_ppt_price,
  } = inputForm;
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);
  const options = useMemo(() => countryList().getData(), []);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setInputForm((formVal) => ({ ...formVal, [name]: value }));
  };

  const onFocus = (event) => {
    event.target.click();
  };

  const handleSubmit = () => {
    setFormErrors(validateForm(inputForm));
  };

  const {
    emailReq,
    fNameReq,
    lNameReq,
    mobileReq,
    validPhone,
    companyReq,
    departmentReq,
    stateReq,
    cityReq,
    postalReq,
    address2Req,
    address1Req,
    countryReq,
    normalPdfReq,
    normalDocReq,
    normalPptReq,
    normalPdfFormPriceReq,
    expeditedPdfPriceReq,
    expeditedDocPriceReq,
    expeditedPptPriceReq,
    rushPptPriceReq,
    rushDocPriceReq,
    rushPdfPriceReq,
  } = validationMsg;

  const validateForm = (values) => {
    const errors = {};

    if (values.rush_pdf_price === "") {
      errors.rush_pdf_price = rushPdfPriceReq;
      rushPdfRef?.current?.focus();
    }

    if (values.rush_doc_price === "") {
      errors.rush_doc_price = rushDocPriceReq;
      rushDocRef?.current?.focus();
    }

    if (values.rush_ppt_price === "") {
      errors.rush_ppt_price = rushPptPriceReq;
      rushPptRef?.current?.focus();
    }

    if (values.expedited_doc_price === "") {
      errors.expedited_ppt_price = expeditedPptPriceReq;
      expeditedPptRef?.current?.focus();
    }

    if (values.expedited_doc_price === "") {
      errors.expedited_doc_price = expeditedDocPriceReq;
      expeditedDocRef?.current?.focus();
    }

    if (values.expedited_pdf_price === "") {
      errors.expedited_pdf_price = expeditedPdfPriceReq;
      expeditedPdfRef?.current?.focus();
    }

    if (values.pdf_form_price === "") {
      errors.pdf_form_price = normalPdfFormPriceReq;
      pdfFormRef?.current?.focus();
    }

    if (values.normal_ppt_price === "") {
      errors.normal_ppt_price = normalPptReq;
      pptRef?.current?.focus();
    }

    if (values.normal_doc_price === "") {
      errors.normal_doc_price = normalDocReq;
      docRef?.current?.focus();
    }

    if (values.normal_pdf_price === "") {
      errors.normal_pdf_price = normalPdfReq;
      pdfRef?.current?.focus();
    }

    if (values.postal_code === "") {
      errors.postal_code = postalReq;
      zipRef?.current?.focus();
    }
    if (values.city === "") {
      errors.city = cityReq;
      cityRef?.current?.focus();
    }

    if (values.state === "") {
      errors.state = stateReq;
      stateRef?.current?.focus();
    }

    if (values.country === "") {
      errors.country = countryReq;
      countryRef?.current?.focus();
    }
    if (values.address2 === "") {
      errors.address2 = address2Req;
      address2Ref?.current?.focus();
    }
    if (values.address1 === "") {
      errors.address1 = address1Req;
      addressRef?.current?.focus();
    }

    if (values.compName === "") {
      errors.compName = companyReq;
      compNameRef?.current?.focus();
    }

    if (values.userEmail === "") {
      errors.userEmail = emailReq;
      emailRef?.current?.focus();
    }

    // if (
    //   values?.mobile_number?.length > 1 &&
    //   values?.mobile_number?.length < 10
    // ) {
    //   errors.mobile_number = validPhone;
    //   phoneRef?.current?.focus();
    // }

    // if (values.mobile_number === "" || values.mobile_number === "+") {
    //   errors.mobile_number = mobileReq;
    //   phoneRef?.current?.focus();
    // }

    if (values.lastName === "") {
      errors.lastName = lNameReq;
      lastNameRef?.current?.focus();
    }
    if (values.firstName === "") {
      errors.firstName = fNameReq;
      firstNameRef?.current?.focus();
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const cancelButton = (e) => {
    navigate(ROUTES.MANAGE_USERS, {
      state: { id: location?.state?.id },
    });
    dispatch(focusElement(location?.state?.id));
    setItem("add", "add");
  };

  useEffect(() => {
    if (error && error?.errors) {
      setFormErrors((prev) => {
        return {
          ...prev,
          userEmail: error?.errors?.email[0],
        };
      });
      emailRef?.current?.focus();
    }
  }, [error]);

  useEffect(() => {
    if (location?.state?.id) {
      const values = { id: location.state.id };
      setInputForm((formVal) => ({
        ...formVal,
        user_id: location?.state?.id,
        firstName: UserDetails?.first_name ?? "",
        lastName: UserDetails?.last_name ?? "",
        userEmail: UserDetails?.email ?? "",
        address1: UserDetails?.address1 ?? "",
        address2: UserDetails?.address2 ?? "",
        state: UserDetails?.state ?? "",
        city: UserDetails?.city ?? "",
        postal_code: UserDetails?.postal_code ?? "",
        normal_pdf_price: UserDetails?.normal_pdf_price ?? "",
        normal_doc_price: UserDetails?.normal_doc_price ?? "",
        normal_ppt_price: UserDetails?.normal_ppt_price ?? "",
        pdf_form_price: UserDetails?.pdf_form_price ?? "",
        compName: UserDetails?.company_name ?? "",
        country: UserDetails?.country
          ? countryList()?.getValue(UserDetails?.country)
          : "",
        mobile_number: "+" + UserDetails?.mobile_number ?? "",
        expedited_pdf_price: UserDetails?.expedited_pdf_price ?? "",
        expedited_doc_price: UserDetails?.expedited_doc_price ?? "",
        expedited_ppt_price: UserDetails?.expedited_ppt_price ?? "",
        rush_pdf_price: UserDetails?.rush_pdf_price ?? "",
        rush_doc_price: UserDetails?.rush_doc_price ?? "",
        rush_ppt_price: UserDetails?.rush_ppt_price ?? "",
      }));
    }
  }, [UserDetails]);

  useEffect(() => {
    firstNameRef?.current?.focus();
    if (location?.state?.mode === "edit") {
      document.title = UPDATE_CUSTOM_USER;
      const values = {
        user_id: location?.state?.id,
      };
      dispatch(getCustomUserById({ token, values }));
    } else {
      document.title = ADD_NEW_CUSTOM_USER;
    }
    return () => {
      dispatch(clearUserErrors());
    };
  }, []);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobile_number,
        email: userEmail,
        company_name: compName,
        address1: address1,
        address2: address2,
        state: state,
        city: city,
        postal_code: postal_code,
        country: countryList()?.getLabel(country),
        normal_doc_price: normal_doc_price,
        normal_pdf_price: normal_pdf_price,
        normal_ppt_price: normal_ppt_price,
        pdf_form_price: pdf_form_price,
        rush_doc_price,
        rush_pdf_price,
        rush_ppt_price,
        expedited_doc_price,
        expedited_pdf_price,
        expedited_ppt_price,
      };
      if (location?.state?.mode === "edit") {
        values.user_id = location?.state?.id;
        dispatch(updateCustomUser({ token, values }));
      } else {
        dispatch(createCustomUser({ token, values }));
      }
    }
    setIsSubmit(false);
    toast(message, {
      className: success ? "_success" : "_error",
      role: "alert",
    });
    if (success) {
      navigate(ROUTES.MANAGE_USERS, {
        state: { id: location?.state?.id },
      });
    }
    return () => {
      dispatch(removeMessage());
    };
  }, [isSubmit, message]);

  return (
    <div className="mainWrapper Create-User-Wrapper p-5">
      <div className="form-width">
        <div className="adduser__header">
          <h2 className="mainTitle" id="table_info">
            Personal Information
          </h2>
        </div>

        <Row>
          <Col md={4}>
            <Input
              type="text"
              autoComplete="first-name"
              label="First Name"
              required={false}
              ref={firstNameRef}
              ErrorLabel={formErrors.firstName ? "First_Name_Error" : null}
              forLabel={"First_Name"}
              name="firstName"
              value={firstName}
              error={formErrors.firstName ? true : false}
              errorMsg={formErrors.firstName}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={4}>
            <Input
              type="text"
              autoComplete="last-name"
              label="Last Name"
              required={false}
              ref={lastNameRef}
              ErrorLabel={formErrors.lastName ? "Last_Name_Error" : null}
              forLabel={"Last_Name"}
              name="lastName"
              value={lastName}
              error={formErrors.lastName ? true : false}
              errorMsg={formErrors.lastName}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={4}>
            <PhoneInputComp
              type="tel"
              autoComplete="tel"
              placeholder="1 (702) 123-4567"
              country={"us"}
              label="Phone"
              name="mobile_number"
              value={mobile_number}
              required={false}
              ref={phoneRef}
              ErrorLabel={formErrors.mobile_number ? "format" : null}
              forLabel={"mobile_number"}
              error={formErrors.mobile_number ? true : false}
              errorMsg={formErrors.mobile_number}
              onChange={(value) => {
                setInputForm((prev) => {
                  return {
                    ...prev,
                    mobile_number: value,
                  };
                });
              }}
            />
          </Col>
          <Col md={6}>
            <Input
              type="email"
              autoComplete="email"
              label="Email"
              required={false}
              ref={emailRef}
              ErrorLabel={formErrors.userEmail ? "Email_Error" : null}
              forLabel={"Email"}
              name="userEmail"
              value={userEmail}
              error={formErrors.userEmail ? true : false}
              errorMsg={formErrors.userEmail}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={6}>
            <Input
              type="text"
              autoComplete="off"
              label="Company Name"
              required={false}
              ref={compNameRef}
              ErrorLabel={formErrors.compName ? "Company_Name_Error" : null}
              forLabel={"Company_Name"}
              name="compName"
              value={compName}
              error={formErrors.compName ? true : false}
              errorMsg={formErrors.compName}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
        </Row>
        <div className="adduser__header">
          <h2 className="mainTitle" id="table_info">
            Address Information
          </h2>
        </div>
        <Row>
          <Col md={6}>
            <Input
              type="text"
              autoComplete="off"
              label="Address 1"
              required={false}
              ref={addressRef}
              ErrorLabel={formErrors.address1 ? "address_Error" : null}
              forLabel={"Address"}
              name="address1"
              value={address1}
              error={formErrors.address1 ? true : false}
              errorMsg={formErrors.address1}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={6}>
            <Input
              type="text"
              autoComplete="off"
              label="Address 2"
              required={false}
              ref={address2Ref}
              ErrorLabel={formErrors.address2 ? "address2_Error" : null}
              forLabel={"Address 2"}
              name="address2"
              value={address2}
              error={formErrors.address2 ? true : false}
              errorMsg={formErrors.address2}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={3}>
            <SelectBox
              className="form-control form-select"
              onChange={onInputChange}
              name="country"
              ref={countryRef}
              value={country}
              options={options}
              label={"Country"}
              forLabel={"Country_Name"}
              ErrorLabel={formErrors.country ? "Country_Error" : null}
              error={formErrors.country ? true : false}
              errorMsg={formErrors.country}
            />
          </Col>
          <Col md={3}>
            <Input
              type="text"
              autoComplete="state"
              label="State"
              required={false}
              ref={stateRef}
              ErrorLabel={formErrors.state ? "State_Error" : null}
              forLabel={"state"}
              name="state"
              value={state}
              error={formErrors.state ? true : false}
              errorMsg={formErrors.state}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={3}>
            <Input
              type="text"
              autoComplete="city"
              label="City"
              required={false}
              ref={cityRef}
              ErrorLabel={formErrors.city ? "City_Error" : null}
              forLabel={"City"}
              name="city"
              value={city}
              error={formErrors.city ? true : false}
              errorMsg={formErrors.city}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={3}>
            <Input
              type="text"
              autoComplete="postal_code"
              label="Zip Code"
              required={false}
              ref={zipRef}
              ErrorLabel={formErrors.postal_code ? "postal_Error" : null}
              forLabel={"Email"}
              name="postal_code"
              value={postal_code}
              error={formErrors.postal_code ? true : false}
              errorMsg={formErrors.postal_code}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
        </Row>

        <div className="adduser__header">
          <h2 className="mainTitle" id="table_info">
            Pricing Details
          </h2>
        </div>
        <Row>
          <Col md={3}>
            <Input
              type="number"
              autoComplete="PDF"
              label="PDF (NORMAL)"
              required={false}
              ref={pdfRef}
              ErrorLabel={formErrors.normal_pdf_price ? "PDF_Error" : null}
              forLabel={"PDF"}
              name="normal_pdf_price"
              value={normal_pdf_price}
              error={formErrors.normal_pdf_price ? true : false}
              errorMsg={formErrors.normal_pdf_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>

          <Col md={3}>
            <Input
              type="number"
              autoComplete="DOC/DOCX"
              label="DOC/DOCX (NORMAL)"
              required={false}
              ref={docRef}
              ErrorLabel={formErrors.normal_doc_price ? "docs_Error" : null}
              forLabel={"DOCS"}
              name="normal_doc_price"
              value={normal_doc_price}
              error={formErrors.normal_doc_price ? true : false}
              errorMsg={formErrors.normal_doc_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>

          <Col md={3}>
            <Input
              type="number"
              autoComplete="PPT/PPTX"
              label="PPT/PPTX (NORMAL)"
              required={false}
              ref={pptRef}
              ErrorLabel={formErrors.normal_ppt_price ? "ppt_Error" : null}
              forLabel={"PPT/PPTX"}
              name="normal_ppt_price"
              value={normal_ppt_price}
              error={formErrors.normal_ppt_price ? true : false}
              errorMsg={formErrors.normal_ppt_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={3}>
            <Input
              type="number"
              autoComplete="pdf_form_price"
              label="PDF Form"
              required={false}
              ref={pdfFormRef}
              ErrorLabel={formErrors.pdf_form_price ? "pdfForm_Error" : null}
              forLabel={"pdf_form_price"}
              name="pdf_form_price"
              value={pdf_form_price}
              error={formErrors.pdf_form_price ? true : false}
              errorMsg={formErrors.pdf_form_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={4}>
            <Input
              type="number"
              autoComplete="off"
              label="PDF (EXPEDITED)"
              required={false}
              ref={expeditedPdfRef}
              ErrorLabel={
                formErrors.expedited_pdf_price ? "expedited_pdf_Error" : null
              }
              forLabel={"expedited_pdf_price"}
              name="expedited_pdf_price"
              value={expedited_pdf_price}
              error={formErrors.expedited_pdf_price ? true : false}
              errorMsg={formErrors.expedited_pdf_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>

          <Col md={4}>
            <Input
              type="number"
              autoComplete="off"
              label="DOC (EXPEDITED)"
              required={false}
              ref={expeditedDocRef}
              ErrorLabel={
                formErrors.expedited_doc_price ? "expedited_doc_Error" : null
              }
              forLabel={"expedited_doc_price"}
              name="expedited_doc_price"
              value={expedited_doc_price}
              error={formErrors.expedited_doc_price ? true : false}
              errorMsg={formErrors.expedited_doc_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>

          <Col md={4}>
            <Input
              type="number"
              autoComplete="off"
              label="PPT (EXPEDITED)"
              required={false}
              ref={expeditedPptRef}
              ErrorLabel={
                formErrors.expedited_ppt_price ? "expedited_ppt_Error" : null
              }
              forLabel={"expedited_ppt_price"}
              name="expedited_ppt_price"
              value={expedited_ppt_price}
              error={formErrors.expedited_ppt_price ? true : false}
              errorMsg={formErrors.expedited_ppt_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={4}>
            <Input
              type="number"
              autoComplete="off"
              label="PDF (RUSH)"
              required={false}
              ref={rushPdfRef}
              ErrorLabel={formErrors.rush_pdf_price ? "rush_pdf_Error" : null}
              forLabel={"rush_pdf_price"}
              name="rush_pdf_price"
              value={rush_pdf_price}
              error={formErrors.rush_pdf_price ? true : false}
              errorMsg={formErrors.rush_pdf_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={4}>
            <Input
              type="number"
              autoComplete="off"
              label="DOC (RUSH)"
              required={false}
              ref={rushDocRef}
              ErrorLabel={formErrors.rush_doc_price ? "rush_doc_Error" : null}
              forLabel={"rush_doc_price"}
              name="rush_doc_price"
              value={rush_doc_price}
              error={formErrors.rush_doc_price ? true : false}
              errorMsg={formErrors.rush_doc_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
          <Col md={4}>
            <Input
              type="number"
              autoComplete="off"
              label="PPT (RUSH)"
              required={false}
              ref={rushPptRef}
              ErrorLabel={formErrors.rush_ppt_price ? "rush_ppt_Error" : null}
              forLabel={"rush_ppt_price"}
              name="rush_ppt_price"
              value={rush_ppt_price}
              error={formErrors.rush_ppt_price ? true : false}
              errorMsg={formErrors.rush_ppt_price}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="form-buttons d-flex align-items-center justify-content-end mt-5">
              <Button
                title={"Cancel"}
                className={"button--border"}
                onClick={cancelButton}
              />
              <Button
                title={location?.state?.mode === "edit" ? `Update` : `Save`}
                className={"button--blue ms-3"}
                onClick={handleSubmit}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CreateCustomUsers;
