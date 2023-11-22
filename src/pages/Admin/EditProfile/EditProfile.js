import React, { useEffect, useMemo, useRef, useState } from "react";
import { EDIT_PROFILE_TITLE } from "constants/title";
import "./EditProfile.scss";
import { Col, Row } from "react-bootstrap";
import Input from "components/inputField";
import SelectBox from "components/SelectBox/SelectBox";
import Button from "components/Button";
import { Avtar, CameraIcon } from "assets/images";
import CustomModal from "components/CustomModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "routes/constant";
import countryList from "react-select-country-list";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "redux/asyncApi/appApi";
import PhoneInputComp from "components/inputField/PhoneInputComp";
import EditPofilePic from "./EditPofilePic";
import { usersTypes } from "util/helpers";
import { validationMsg } from "util/validationErrors";

const EditProfile = () => {
  document.title = EDIT_PROFILE_TITLE;
  const [show, setShow] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const {
    userDetails,
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app);
  const { user } = userDetails;
  const [formData, setFormData] = useState({
    profilePic: user?.profile_image ?? "",
    firstName: user?.first_name ?? "",
    lastName: user?.last_name ?? "",
    userEmail: user?.email ?? "",
    phone: user?.mobile_number ? String("+" + user?.mobile_number) : "",
    designation: user?.designation ?? "",
    companyName: user?.company_name ?? "",
    plan: user?.plan ?? "",
    imageDescription: user?.description ?? "",
    croppedImage: "",
    imgRemoved: false,
    email: user?.email,
    department: user?.department ?? "",
    country: user?.address?.country
      ? countryList()?.getValue(user?.address?.country)
      : "",
    address1: user?.address?.address1 ?? "",
    address2: user?.address?.address2 ?? "",
    state: user?.address?.state ?? "",
    city: user?.address?.city ?? "",
    postal_code: user?.address?.postal_code ?? "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const options = useMemo(() => countryList().getData(), []);

  const {
    admin,
    companyUser,
    postpaidAdmin,
    postpaidUser,
    user: payUser,
    superAdmin,
    rootAdmin,
  } = usersTypes;
  const showField =
    role !== payUser &&
    role !== superAdmin &&
    role !== postpaidUser &&
    role !== rootAdmin;

  const disableValidation =
    role !== payUser &&
    role !== companyUser &&
    role !== admin &&
    role !== postpaidAdmin &&
    role !== postpaidUser;

  const isDisabledfield =
    role === admin ||
    role === companyUser ||
    role === postpaidAdmin ||
    role === postpaidUser;

  const navigate = useNavigate();
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const planRef = useRef();
  const phoneRef = useRef();
  const address1Ref = useRef();
  const address2Ref = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const zipCodeRef = useRef();
  const departmentRef = useRef();

  const {
    fNameReq,
    lNameReq,
    departmentReq,
    stateReq,
    cityReq,
    postalReq,
    countryCodeReq,
    address2Req,
    address1Req,
  } = validationMsg;

  const {
    firstName,
    lastName,
    userEmail,
    phone,
    designation,
    companyName,
    country,
    plan,
    profilePic,
    imageDescription,
    croppedImage,
    // email,
    imgRemoved,
    address1,
    address2,
    state,
    city,
    postal_code,
    department,
  } = formData;

  useEffect(() => {
    firstNameRef?.current?.focus();
    if (isSubmit) {
      const values = {
        first_name: firstName,
        last_name: lastName,
        mobile_number: phone ?? "",
        designation: designation,
        company_name: companyName,
        country: countryList().getLabel(formData.country) || formData.country,
        profile_image: croppedImage,
        description: imageDescription,
        image_removed: imgRemoved,
        address1: address1,
        address2: address2,
        state: state,
        city: city,
        postal_code: postal_code,
        department: department,
        // email: email,
      };
      if (imageDescription === "" || values.profile_image === "") {
        delete values.profile_image;
        delete values.description;
      }
      dispatch(updateUserDetails({ token, values })).then(({ payload }) => {
        if (payload.status) {
          navigate(-1);
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

  const cancelButton = () => {
    navigate(ROUTES.PROFILE);
  };

  const validateForm = (values) => {
    const errors = {};
    if (values.postal_code === "") {
      errors.postal_code = postalReq;
      zipCodeRef?.current?.focus();
    }
    if (values.city === "") {
      errors.city = cityReq;
      cityRef?.current?.focus();
    }
    if (values.state === "") {
      errors.state = stateReq;
      stateRef?.current?.focus();
    }
    if (values.address2 === "") {
      errors.address2 = address2Req;
      address1Ref?.current?.focus();
    }
    if (values.address1 === "") {
      errors.address1 = address1Req;
      address1Ref?.current?.focus();
    }
    if (values?.phone?.length > 0 && !values?.phone?.includes("+")) {
      errors.phone = countryCodeReq;
      phoneRef?.current?.focus();
    }
    // if (disableValidation) {
    //   if (values.department === "") {
    //     errors.department = departmentReq;
    //     departmentRef?.current?.focus();
    //   }
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

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
  };

  const onImageSaveHandler = ({ croppedImage, description }) => {
    setFormData((prev) => {
      return {
        ...prev,
        profilePic: URL.createObjectURL(croppedImage),
        croppedImage: croppedImage,
        imageDescription: description,
      };
    });
  };

  const removeImgHandler = () => {
    setFormData((prev) => {
      return {
        ...prev,
        profilePic: "",
        croppedImage: "",
        imageDescription: "",
        imgRemoved: true,
      };
    });
  };

  return (
    <>
      <div className="mainWrapper EditProfile">
        <div className="main-content">
          <Row>
            <Col md="12" lg="3">
              <div className="EditProfile__uploadWrap">
                <div className="EditProfile__uploadimg">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={
                        imageDescription === ""
                          ? "No description"
                          : imageDescription
                      }
                    />
                  ) : (
                    <Avtar aria-hidden="true" focusable="false" />
                  )}
                  <button className="upicon" onClick={handleShow}>
                    <CameraIcon
                      role="img"
                      aria-label="Change profile image"
                      focusable="false"
                    />
                  </button>
                </div>
                {profilePic ? (
                  <button onClick={removeImgHandler}>
                    Remove profile image
                  </button>
                ) : (
                  <button onClick={handleShow}>Add profile image</button>
                )}
              </div>
            </Col>
            <Col md="12" lg="9">
              <div className="EditProfile_form">
                <Row>
                  <Col sm="6" md="6">
                    <Input
                      type="text"
                      autoComplete="first-name"
                      label="First Name:"
                      required={false}
                      ref={firstNameRef}
                      ErrorLabel={
                        formErrors.firstName ? "Last_Name_Error" : null
                      }
                      forLabel={"First_Name"}
                      name="firstName"
                      value={firstName}
                      error={formErrors.firstName ? true : false}
                      errorMsg={formErrors.firstName}
                      // onFocus={onFocus}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col sm="6" md="6">
                    <Input
                      type="text"
                      autoComplete="last-name"
                      label="Last Name:"
                      required={false}
                      ref={lastNameRef}
                      ErrorLabel={
                        formErrors.lastName ? "Last_Name_Error" : null
                      }
                      forLabel={"Last_Name"}
                      name="lastName"
                      value={lastName}
                      error={formErrors.lastName ? true : false}
                      errorMsg={formErrors.lastName}
                      // onFocus={onFocus}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col sm="6" md="6">
                    <Input
                      disabled={true}
                      type="email"
                      autoComplete="email"
                      label="Email:"
                      required={false}
                      ref={emailRef}
                      ErrorLabel={
                        formErrors.userEmail ? "Last_Name_Error" : null
                      }
                      forLabel={"User_Email"}
                      name="userEmail"
                      value={userEmail}
                      error={formErrors.userEmail ? true : false}
                      errorMsg={formErrors.userEmail}
                      // onFocus={onFocus}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col sm="6" md="6">
                    <PhoneInputComp
                      type="tel"
                      autoComplete="tel"
                      placeholder="1 (702) 123-4567"
                      country={"us"}
                      label="Mobile Number(optional):"
                      name="phone"
                      value={phone}
                      required={false}
                      ref={phoneRef}
                      ErrorLabel={formErrors.phone ? "format" : null}
                      forLabel={"phone"}
                      error={formErrors.phone ? true : false}
                      errorMsg={formErrors.phone}
                      onChange={(value) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            phone: value,
                          };
                        });
                      }}
                    />
                  </Col>
                  {showField && (
                    <Col sm="6" md="6">
                      <Input
                        disabled={isDisabledfield}
                        type="text"
                        autoComplete="organization-title"
                        label="Department:"
                        required={false}
                        ref={departmentRef}
                        ErrorLabel={
                          formErrors.department ? "department_Error" : null
                        }
                        forLabel={"Department"}
                        name="department"
                        value={department}
                        error={formErrors.department ? true : false}
                        errorMsg={formErrors.department}
                        // onFocus={onFocus}
                        onInputChange={onInputChange}
                      />
                    </Col>
                  )}
                  <Col sm="6" md="6">
                    <Input
                      type="text"
                      autoComplete="organization-title"
                      label="Designation (Optional):"
                      required={false}
                      // ref={lastNameRef}countryName
                      ErrorLabel={
                        formErrors.designation ? "Last_Name_Error" : null
                      }
                      forLabel={"Designation"}
                      name="designation"
                      value={designation}
                      error={formErrors.designation ? true : false}
                      errorMsg={formErrors.designation}
                      // onFocus={onFocus}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col sm="6" md="6">
                    <Input
                      type="text"
                      autoComplete="organization"
                      label="Company Name (optional):"
                      required={false}
                      forLabel={"Company_Name"}
                      name="companyName"
                      value={companyName}
                      onInputChange={onInputChange}
                    />
                  </Col>
                  <Col sm="6" md="6">
                    <SelectBox
                      disabled={isDisabledfield}
                      className="form-control form-select"
                      onChange={onInputChange}
                      name="country"
                      value={country}
                      options={options}
                      label={"Country (Optional):"}
                      forLabel={"Country_Name"}
                    />
                  </Col>
                  <Col sm="6" md="6">
                    <Input
                      disabled={true}
                      type="text"
                      autoComplete="off"
                      label={"Plan:"}
                      required={false}
                      forLabel={"Plan"}
                      onInputChange={onInputChange}
                      name="plan"
                      onChange={onInputChange}
                      value={plan}
                      ErrorLabel={formErrors.plan ? "Plan_Error" : null}
                      ref={planRef}
                      error={formErrors.plan ? true : false}
                      errorMsg={formErrors.plan}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      disabled={isDisabledfield}
                      type="text"
                      autoComplete="address-line1"
                      label="Address 1:"
                      required={false}
                      forLabel={"address_1"}
                      onInputChange={onInputChange}
                      name="address1"
                      value={address1}
                      ErrorLabel={
                        formErrors.address1 ? "address_1_Error" : null
                      }
                      ref={address1Ref}
                      error={formErrors.address1 ? true : false}
                      errorMsg={formErrors.address1}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      disabled={isDisabledfield}
                      type="text"
                      autoComplete="address-line2"
                      label="Address 2:"
                      required={false}
                      forLabel={"address_2"}
                      onInputChange={onInputChange}
                      name="address2"
                      value={address2}
                      ErrorLabel={
                        formErrors.address2 ? "address_2_Error" : null
                      }
                      ref={address2Ref}
                      error={formErrors.address2 ? true : false}
                      errorMsg={formErrors.address2}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      disabled={isDisabledfield}
                      type="text"
                      autoComplete=""
                      label="State"
                      required={false}
                      forLabel={"State"}
                      onInputChange={onInputChange}
                      name="state"
                      value={state}
                      ErrorLabel={formErrors.state ? "State_Error" : null}
                      ref={stateRef}
                      error={formErrors.state ? true : false}
                      errorMsg={formErrors.state}
                    />
                  </Col>{" "}
                  <Col md={6}>
                    <Input
                      disabled={isDisabledfield}
                      type="text"
                      autoComplete=""
                      label="City"
                      required={false}
                      forLabel={"City"}
                      onInputChange={onInputChange}
                      name="city"
                      value={city}
                      ErrorLabel={formErrors.city ? "City_Error" : null}
                      ref={cityRef}
                      error={formErrors.city ? true : false}
                      errorMsg={formErrors.city}
                    />
                  </Col>{" "}
                  <Col md={6}>
                    <Input
                      disabled={isDisabledfield}
                      type="text"
                      autoComplete=""
                      label="Zip Code"
                      required={false}
                      forLabel={"Zip_Code"}
                      onInputChange={onInputChange}
                      name="postal_code"
                      value={postal_code}
                      ErrorLabel={
                        formErrors.postal_code ? "Zip_Code_Error" : null
                      }
                      ref={zipCodeRef}
                      error={formErrors.postal_code ? true : false}
                      errorMsg={formErrors.postal_code}
                    />
                  </Col>
                  <Col md={12}>
                    <div className="form-buttons d-flex align-items-center justify-content-end mt-5">
                      <Button
                        title={"Cancel"}
                        className={"button--border"}
                        onClick={cancelButton}
                      />
                      <Button
                        title={"Update Profile"}
                        className={"button--blue ms-3"}
                        onClick={onSubmitHandler}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <CustomModal
        show={show}
        handleClose={handleClose}
        modalHeading="Upload Profile picture"
        className="ImageModal"
      >
        <div className="customModalBody">
          <EditPofilePic
            handleClose={handleClose}
            onImageSaveHandler={onImageSaveHandler}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default EditProfile;
