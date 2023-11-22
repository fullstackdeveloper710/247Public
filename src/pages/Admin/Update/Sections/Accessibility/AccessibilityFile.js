import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { accessibility } from "redux/Slices/uploadSlice";
import Input from "components/inputField";
import { InfoIcon, Question } from "assets/images";
import Button from "components/Button";
import SelectBox from "components/SelectBox/SelectBox";
import { accessibilityFiles } from "redux/asyncApi/uploadApi";
import Checkbox from "components/Checkbox/Checkbox";
import { toast } from "react-toastify";
import { usersTypes } from "util/helpers";
import CustomTooltip from "components/CustomTootip";
import { message } from "util/message";
import { validationMsg } from "util/validationErrors";

const AccessibilityFile = ({ handleBack, handleNext }) => {
  const { accessibilityPage, uploadedFiles, selectedUser } = useSelector(
    (state) => state.upload
  );
  const {
    token,
    user: { role },
  } = useSelector((state) => state.app.userAuth);
  const [data, setData] = useState({
    acc_complaince_level: accessibilityPage?.acc_complaince_level ?? "",
    acc_additional_instruction:
      accessibilityPage?.acc_additional_instruction ?? "",
    acc_confirmation: accessibilityPage?.acc_confirmation ?? false,
    acc_extend_alt: accessibilityPage?.acc_extend_alt ?? false,
    acc_tabel_summary: accessibilityPage?.acc_tabel_summary ?? false,
  });

  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();

  const complainceRef = useRef();
  const confirmationRef = useRef();

  const { user } = usersTypes;

  const saveData = () => {
    setFormErrors(validateForm(data));
    if (Object.keys(validateForm(data)).length === 0) {
      dispatch(accessibility(data));
      const values = {
        ...data,
        order_temp_id: uploadedFiles.order_temp_id,
        user_id: selectedUser?.value,
      };
      dispatch(accessibilityFiles({ token, values })).then(({ payload }) => {
        if (payload.status) {
          handleNext();
        }
      });
    }
  };

  const handleChange1 = (e) => {
    setData({ ...data, acc_complaince_level: e.target.value });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleChangeCheckbox = (e) => {
    if (role === user && e.target.name !== "acc_confirmation") {
      toast.info(message.updateSubForFeature);
    } else {
      setData({ ...data, [e.target.name]: e.target.checked });
    }
  };

  const options = [
    { id: 0, type: "WCAG 2.0 Level AA and PDF U/A" },
    { id: 1, type: "WCAG 2.1 Level AA and PDF U/A" },
    { id: 2, type: "HHS Guideline" },
  ];

  let label = "What Compliance Level do you want to meet?";

  const onFocus = (event) => {
    event.target.click();
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.acc_complaince_level || values.acc_complaince_level === "") {
      errors.acc_complaince_level = validationMsg.accComReq;
      complainceRef?.current?.focus();
    }
    // if (!values.acc_confirmation) {
    //   errors.acc_confirmation = "Please enter confirmation";
    //   // confirmationRef.current.focus();
    // }
    return errors;
  };

  return (
    <div className="customCard accessibility_File_Block">
      <h2 className="mainTitle">Accessibility Requirement</h2>
      <div className="form-area mt-4">
        <Row>
          <Col md={12} lg={6}>
            <SelectBox
              className="form-control form-select"
              onFocus={onFocus}
              onChange={handleChange1}
              value={data.acc_complaince_level}
              options={options}
              label={label}
              forLabel="acc_req"
              ErrorLabel={
                formErrors.acc_complaince_level
                  ? "acc_complaince_level_Error"
                  : null
              }
              ref={complainceRef}
              error={formErrors.acc_complaince_level ? true : false}
              errorMsg={formErrors.acc_complaince_level}
            />
          </Col>

          <Col md={12} lg={6}>
            <Input
              type="text"
              autoComplete="off"
              label={`Additional Instructions (Optional): ${data?.acc_additional_instruction?.length}/100`}
              required={false}
              forLabel="acc_additional_instruction"
              // ErrorLabel={""}
              maxLength="100"
              name="acc_additional_instruction"
              value={data.acc_additional_instruction}
              onInputChange={handleChange}
            />
          </Col>

          <Col md={12}>
            <div className="inputRow">
              <Checkbox
                type="checkbox"
                id="contrast_Checkbox"
                name="acc_confirmation"
                checked={data.acc_confirmation}
                onChange={handleChangeCheckbox}
                ref={confirmationRef}
                ErrorLabel={
                  formErrors?.acc_confirmation
                    ? "complaince confirmation level error"
                    : null
                }
                label={`Please confirm that you would like 247 Accessible Documents to change colors to meet color contrast ratios as specified under ${
                  data?.acc_complaince_level === "WCAG 2.0 Level AA and PDF U/A"
                    ? "WCAG 2.0 AA success criteria 1.4.3."
                    : data?.acc_complaince_level ===
                      "WCAG 2.1 Level AA and PDF U/A"
                    ? "WCAG 2.1 AA success criteria 1.4.3 and 1.4.11."
                    : data?.acc_complaince_level.concat(
                        " ",
                        "success criteria."
                      )
                } (Optional)`}
                error={formErrors?.acc_confirmation}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className="acc_note">
        <h3 className="mb-1">Note:</h3>
        <p>
          If you have used background or layered images, 247 Accessible
          Documents would be unable to manipulate them.
        </p>
      </div>
      <h2 className="mainTitle mt-4 mb-2" id="add_serv">
        Additional Services (Optional for Premium and Enterprise users)
      </h2>

      <div className="form-area-2 mt-0" role="group" aria-labelledby="add_serv">
        <Row>
          <Col md={12}>
            <div className="inputRow ">
              <div className="customCheckbox d-flex align-items-center">
                <input
                  type="checkbox"
                  id="extended_alt_Checkbox"
                  name="acc_extend_alt"
                  checked={data.acc_extend_alt}
                  onChange={handleChangeCheckbox}
                />
                <label htmlFor="extended_alt_Checkbox" className="mt-0 mb-0 ">
                  Do you want extended alt?
                </label>
                <CustomTooltip
                  heading="Extended Alt"
                  content="Alt-Text of more than 300 characters is considered
                  extended alt."
                  Icon={InfoIcon}
                  tooltipId="extended-alt-tooltip"
                  contentclass="tip-content"
                  iconClass="tooltip_icon"
                  mainClass="custom_tooltip"
                />
              </div>
            </div>
          </Col>
          <Col md={12}>
            <div className="inputRow ">
              <div className="customCheckbox d-flex align-items-center">
                <input
                  type="checkbox"
                  id="table_summary_Checkbox"
                  name="acc_tabel_summary"
                  checked={data.acc_tabel_summary}
                  onChange={handleChangeCheckbox}
                />
                <label htmlFor="table_summary_Checkbox" className="mt-0 mb-0">
                  Do you want table summary?{" "}
                </label>
                <CustomTooltip
                  heading="Table Summary"
                  content="Brief description of how the data is organized in a
                  complex table."
                  Icon={Question}
                  tooltipId="table-summary-tooltip"
                  contentclass="tip-content"
                  iconClass="tooltip_icon"
                  mainClass="custom_tooltip"
                />
              </div>
            </div>

            <div className="acc_note mt-5">
              <h3 className="mb-1">Note:</h3>
              <p>
                If you opt for any Additional Services, this cost will be added
                at the time of the delivery based on number of extended alt text
                and table summaries needed.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
        <Button
          title={"Back"}
          className={"button--border"}
          onClick={() => handleBack()}
        />
        <Button
          title={"Next"}
          className={"button--blue ms-3"}
          onClick={() => saveData()}
        />
      </div>
    </div>
  );
};

export default AccessibilityFile;
