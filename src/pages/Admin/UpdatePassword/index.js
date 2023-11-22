import Button from "components/Button";
import Input from "components/inputField";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors } from "redux/Slices/appSlice";
import { updatePassword } from "redux/asyncApi/appApi";
import { validationMsg } from "util/validationErrors";

const UpdatePassword = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const { newPassword, confirmPassword, oldPassword } = formData;

  //Redux state
  const {
    userAuth: { token },
    errors,
  } = useSelector((state) => state.app);

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Router functions
  const params = useParams();
  const { id } = params;

  //Ref
  const oldPassRef = useRef();
  const newPassRef = useRef();
  const confirmPassRef = useRef();

  //Validation messages
  const { newPassReq, confirmNewPassReq, validNewCofirmPass, oldPassReq } =
    validationMsg;

  //Methods

  useEffect(() => {
    if (isSubmit) {
      const values = {
        old_password: oldPassword,
        password: confirmPassword,
      };

      console.log(values, "values");
      dispatch(updatePassword({ token, values })).then(({ payload }) => {
        if (payload.status) {
          handleClose();
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);

  useEffect(() => {
    if (errors) {
      setFormErrors({ ...formErrors, ...errors });
      oldPassRef.current.focus();
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [errors]);

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
      errors.confirmPassword = confirmNewPassReq;
      confirmPassRef.current.focus();
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = validNewCofirmPass;
      confirmPassRef.current.focus();
    }
    if (values.newPassword === "") {
      errors.newPassword = newPassReq;
      newPassRef.current.focus();
    }
    if (values.oldPassword === "") {
      errors.oldPassword = oldPassReq;
      oldPassRef.current.focus();
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
    <div>
      <Row>
        <Col sm="12">
          <Input
            type="password"
            autoComplete="off"
            label="Old Password:"
            required={false}
            forLabel={"old_password"}
            name="oldPassword"
            value={oldPassword}
            onInputChange={onInputChange}
            ref={oldPassRef}
            ErrorLabel={formErrors.oldPassword ? "old_password_error" : null}
            error={formErrors.oldPassword ? true : false}
            errorMsg={formErrors.oldPassword}
          />
        </Col>
        <Col sm="12">
          <Input
            type="password"
            autoComplete="off"
            label="New Password:"
            required={false}
            forLabel={"new_password"}
            name="newPassword"
            value={newPassword}
            onInputChange={onInputChange}
            ref={newPassRef}
            ErrorLabel={formErrors.newPassword ? "new_password_error" : null}
            error={formErrors.newPassword ? true : false}
            errorMsg={formErrors.newPassword}
          />
        </Col>
        <Col sm="12">
          <Input
            type="password"
            autoComplete="organization"
            label="Confirm Password:"
            required={false}
            forLabel={"confirm_pasword"}
            name="confirmPassword"
            value={confirmPassword}
            onInputChange={onInputChange}
            ref={confirmPassRef}
            ErrorLabel={
              formErrors.confirmPassword ? "confirm_pasword_error" : null
            }
            error={formErrors.confirmPassword ? true : false}
            errorMsg={formErrors.confirmPassword}
          />
        </Col>

        <Col sm="12">
          <div className="d-flex align-items-center justify-content-center">
            <Button
              title={"Cancel"}
              className={"button--border me-3"}
              onClick={handleClose}
            />
            <Button
              title={"Submit"}
              className={"button--blue"}
              onClick={onSubmitHandler}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UpdatePassword;
