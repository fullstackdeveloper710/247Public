import React, { useEffect, useState, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "components/Button";
import Input from "components/inputField";
import { setItem } from "constants/localstorage";
import { ADD_NEW_USER, UPDATE_USER } from "constants/title";
import { addNewUser, getUserByID, updateUser } from "redux/asyncApi/userApi";
import {
  removeMessage,
  focusElement,
  clearUserErrors,
} from "redux/Slices/userSlice";
import { usersTypes } from "util/helpers";
import { ROUTES } from "routes/constant";
import { validationMsg } from "util/validationErrors";
import SelectComponent from "components/SelectComp";
import {
  addDepartment,
  editDepartment,
  getDepartmentList,
} from "redux/asyncApi/appApi";
import "./createUser.scss";

const CreateUsers = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputForm, setInputForm] = useState({
    firstName: "",
    lastName: "",
    userEmail: "",
    isAdmin: false,
    isBillingAdmin: false,
    userDepartment: "",
  });
  const {
    firstName,
    lastName,
    userEmail,
    isAdmin,
    userDepartment,
    isBillingAdmin,
  } = inputForm;

  //Redux State
  const { addUpdateUser, error } = useSelector((state) => state?.user) || {};
  const { success, message } = addUpdateUser || {};
  const { user: UserDetails } =
    useSelector((state) => state.user?.getUserDataById) || {};
  const {
    userAuth: {
      token,
      user: { role },
    },
    departmentList,
  } = useSelector((state) => state.app);

  const {
    email,
    first_name,
    is_admin,
    last_name,
    id,
    department,
    is_billing_admin,
  } = UserDetails || {};

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Router functions
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;

  //Ref
  const firstNameRef = useRef(HTMLAllCollection);
  const lastNameRef = useRef(HTMLAllCollection);
  const emailRef = useRef(HTMLAllCollection);
  const departmentRef = useRef(HTMLAllCollection);

  //Form validation messages
  const { fNameReq, lNameReq, emailReq, departmentReq } = validationMsg;

  //User roles
  const { admin, postpaidAdmin, billingAdmin, postpaidRoot, postpaidUser } =
    usersTypes;

  //hide make admin checkbox condition
  const hideMakeAdmin =
    role !== admin && role !== postpaidAdmin && role !== billingAdmin;

  const hideBillingAdmin =
    role !== postpaidRoot &&
    role !== postpaidUser &&
    state?.user_role !== postpaidUser &&
    state?.user_role !== postpaidAdmin;
  const hideDepartmentField = role !== postpaidAdmin;

  //Methods
  useEffect(() => {
    dispatch(getDepartmentList(token));
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
      dispatch(getUserByID({ token, values }));
      setInputForm((formVal) => ({ ...formVal, user_id: location?.state?.id }));
    }
  }, [location?.state?.id]);

  useEffect(() => {
    firstNameRef?.current?.focus();
    if (location?.state?.mode === "edit") {
      document.title = UPDATE_USER;
      setInputForm((formVal) => ({
        ...formVal,
        firstName: first_name,
        lastName: last_name,
        userEmail: email,
        isAdmin: is_admin === "Y" ? true : false,
        isBillingAdmin: is_billing_admin === "Y" ? true : false,
        userDepartment: department?.[0]
          ? department?.[0]?.department_name
          : null,
      }));
    } else {
      document.title = ADD_NEW_USER;
      setInputForm((formVal) => ({
        ...formVal,
        firstName: "",
        lastName: "",
        userEmail: "",
        isAdmin: false,
        isBillingAdmin: false,
        userDepartment: "",
      }));
    }
    return () => {
      dispatch(clearUserErrors());
    };
  }, [email, first_name, is_admin, is_billing_admin, last_name, department]);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        first_name: inputForm.firstName,
        last_name: inputForm.lastName,
        email: inputForm.userEmail,
        is_admin: inputForm.isAdmin,
        is_billing_admin: inputForm.isBillingAdmin,
        department: inputForm?.userDepartment === "" ? "main":inputForm?.userDepartment,
      };
      if (location?.state?.mode === "edit") {
      values.user_id = id;
      dispatch(updateUser({ token, values }));
      } else {
      dispatch(addNewUser({ values, token }));
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

  const onInputChange = (event, name) => {
    const { value } = event.target;
    setInputForm((formVal) => ({ ...formVal, [name]: value }));
  };

  const onFocus = (event) => {
    event.target.click();
  };

  const handleIsAdmin = (event) => {
    const { checked } = event.target;
    console.log(checked, "is admin");
    setInputForm((formVal) => ({
      ...formVal,
      isAdmin: checked,
      isBillingAdmin: false,
    }));
  };

  const handleIsBillingAdmin = (event) => {
    const { checked } = event.target;
    console.log(checked, "billing admin");
    setInputForm((formVal) => ({
      ...formVal,
      isBillingAdmin: checked,
      isAdmin: false,
    }));
  };

  const handleSubmit = () => {
    setFormErrors(validateForm(inputForm));
  };

  const validateForm = (values) => {
    const errors = {};
    // if (hideDepartmentField) {
    //   if (!values.userDepartment && values.userDepartment === "") {
    //     errors.userDepartment = departmentReq;
    //     departmentRef?.current?.focus();
    //   }
    // }
    if (values.userEmail === "") {
      errors.userEmail = emailReq;
      emailRef?.current?.focus();
    }
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

  const addNewOptionHandler = (value) => {
    const values = {
      department_name: value,
    };
    dispatch(addDepartment({ token, values }));
  };

  const editDepartmentHandler = (value) => {
    const values = {
      id: value.id,
      department_name: value.label,
    };
    dispatch(editDepartment({ token, values }));
  };

  const selectedDepartment = (value) => {
    setInputForm((prev) => {
      return {
        ...prev,
        userDepartment: value,
      };
    });
  };

  const onKeyDownHandler = (e) => {
    const { key } = e;
    if (key === "Enter") {
      setIsOpen(false);
    }
    if (key === "Escape") {
      setIsOpen(false);
    }
  };
  return (
    <div
      className="mainWrapper Create-User-Wrapper p-5"
      onKeyDown={onKeyDownHandler}
    >
      <div className="form-width">
        <Row>
          <Col md={6}>
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
          <Col md={6}>
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
          {/* <Col md={6}>
            <Input
              type="text"
              autoComplete="off"
              label="Department"
              required={false}
              ref={departmentRef}
              ErrorLabel={formErrors.userDepartment ? "department_Error" : null}
              forLabel={"Department"}
              name="userDepartment"
              value={userDepartment}
              error={formErrors.userDepartment ? true : false}
              errorMsg={formErrors.userDepartment}
              onFocus={onFocus}
              onInputChange={onInputChange}
            />
          </Col> */}
          {hideDepartmentField && (
            <Col md={6}>
              <SelectComponent
                readOnly={true}
                options={departmentList?.departments ?? []}
                addNewOptionHandler={addNewOptionHandler}
                editDepartmentHandler={editDepartmentHandler}
                placeholder="Select option"
                selectedDepartment={selectedDepartment}
                userDepartment={userDepartment}
                label="Department"
                required={false}
                ref={departmentRef}
                ErrorLabel={
                  formErrors.userDepartment ? "department_Error" : null
                }
                forLabel={"Department"}
                error={formErrors.userDepartment ? true : false}
                errorMsg={formErrors.userDepartment}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </Col>
          )}
          {hideMakeAdmin && (
            <>
              <Col md={6}>
                <div className="inputRow ">
                  <label className="d-mobile-none"></label>
                  <div className="customCheckbox">
                    <input
                      type="checkbox"
                      id="admin_Checkbox"
                      name="admin_Checkbox"
                      checked={isAdmin}
                      onChange={handleIsAdmin}
                    />
                    <label htmlFor="admin_Checkbox" className="mt-4 mb-0">
                      Make as Admin?
                    </label>
                  </div>
                </div>
              </Col>

              {hideBillingAdmin && (
                <Col md={6}>
                  <div className="inputRow ">
                    <label className="d-mobile-none"></label>
                    <div className="customCheckbox">
                      <input
                        type="checkbox"
                        id="billing_admin_Checkbox"
                        name="billing_admin_Checkbox"
                        checked={isBillingAdmin}
                        onChange={handleIsBillingAdmin}
                      />
                      <label
                        htmlFor="billing_admin_Checkbox"
                        className="mt-4 mb-0"
                      >
                        Make as Billing Admin?
                      </label>
                    </div>
                  </div>
                </Col>
              )}
            </>
          )}
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

export default CreateUsers;
