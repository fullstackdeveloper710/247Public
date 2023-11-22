import { ArrowRight, SiteLogo } from "assets/images";
import Button from "components/Button";
import Input from "components/inputField";
import { CREATE_PASSWORD_TITLE } from "constants/title";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { createPassword } from "redux/asyncApi/appApi";
import { ROUTES } from "routes/constant";
import { useNavigate } from "react-router-dom";
import { validationMsg } from "util/validationErrors";

const CreatePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { newPassword, confirmPassword } = formData;

  //Tab title
  document.title = CREATE_PASSWORD_TITLE;

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Router functions
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  //Ref
  const newPassRef = useRef();
  const confirmPassRef = useRef();

  //Form validation messages
  const { updatePassReq, confirmPassReq, validUpdateCofirmPass } =
    validationMsg;

  //Methods
  useEffect(() => {
    if (isSubmit) {
      const values = {
        password: newPassword,
        password_confirmation: confirmPassword,
        user_id: id,
      };
      dispatch(createPassword(values)).then(({ payload }) => {
        if (payload.status) {
          navigate(ROUTES.SIGN_IN);
        }
      });
    }
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
    if (values.confirmPassword === "") {
      errors.confirmPassword = confirmPassReq;
      confirmPassRef.current.focus();
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = validUpdateCofirmPass;
      confirmPassRef.current.focus();
    }
    if (values.newPassword === "") {
      errors.newPassword = updatePassReq;
      newPassRef.current.focus();
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
    <div className="auth">
      <div className="auth__Wrapper">
        <div className="auth__dialog">
          <div className="auth__inner">
            <div className="auth__header">
              <SiteLogo />
              <div className="auth__header__info">
                <h1>You are Verified!</h1>
              </div>
            </div>

            <div className="auth__body">
              <Row>
                <Col md="12">
                  <Input
                    type="password"
                    autoComplete="off"
                    label="Update Password:"
                    confirmPass
                    required={false}
                    ref={newPassRef}
                    ErrorLabel={
                      formErrors.newPassword ? "Update_Password_Error" : null
                    }
                    forLabel={"Update_Password"}
                    name="newPassword"
                    value={newPassword}
                    error={formErrors.newPassword ? true : false}
                    errorMsg={formErrors.newPassword}
                    onInputChange={onInputChange}
                  />
                </Col>
                <Col md="12">
                  <Input
                    type="password"
                    autoComplete="off"
                    label="Confirm Password:"
                    required={false}
                    ref={confirmPassRef}
                    ErrorLabel={
                      formErrors.confirmPassword
                        ? "Confirm_Password_Error"
                        : null
                    }
                    forLabel={"Confirm_Password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    error={formErrors.confirmPassword ? true : false}
                    errorMsg={formErrors.confirmPassword}
                    onInputChange={onInputChange}
                  />
                </Col>

                <Col md="12">
                  <div className="auth__buttons">
                    <Button
                      title={"Sign In"}
                      className={"button--blue"}
                      icon={<ArrowRight aria-hidden="true" focusable="false" />}
                      onClick={onSubmitHandler}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <p className="auth__footer">
          © 2023 247 Accessible Documents Pte. Ltd. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default CreatePassword;
