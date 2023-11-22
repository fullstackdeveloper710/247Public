import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./documents.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkloadFile, updateWorkloadFile } from "redux/asyncApi/userApi";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowDownLong, CheckIcon, Clear } from "assets/images";
import moment from "moment";
import { dateFormat } from "util/helpers";
import { validationMsg } from "util/validationErrors";

const DocumentDetails = () => {
  //Redux state
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);

  const { workload_file } = useSelector((state) => state.user);
  const { file, order_process, order_process_data } = workload_file || {};
  //React state
  const [formData, setFormData] = useState({
    file_status: "",
    order_id: "",
    order_file_id: "",
    accessibilty_report_file: "",
    pac_file: "",
    adobe_accessibility_report_file: "",
    accessibility_compliance: false,
    comment: "",
    chk_clr_cnst: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const { file_status } = formData;

  //Dispatch action function
  const dispatch = useDispatch();

  //Router functions
  const navigate = useNavigate();
  const location = useLocation();

  // ref
  const accComplianceRef = useRef();
  const wcagContrastRef = useRef();

  useEffect(() => {
    setFormData((prev) => {
      return {
        ...prev,
        file_status: file?.file_status ?? "",
        order_id: file?.order_id ?? "",
        order_file_id: file?.id ?? "",
        accessibility_compliance:
          order_process?.accessibility_compliance === "Y" ? true : false,
        comment: order_process?.comment
          ? order_process?.comment
          : file?.comments
          ? file?.comments
          : "",
        chk_clr_cnst: order_process?.chk_clr_cnst,
      };
    });
  }, [file, order_process]);

  useEffect(() => {
    setFormData((prev) => {
      return {
        ...prev,
        file_status: file?.file_status ?? "",
      };
    });
    if (location?.state) {
      const values = {
        id: location.state.id,
        user_id: location.state.user_id,
        order_id: location.state.order_id,
      };
      dispatch(fetchWorkloadFile({ token, values })).then((response) => {
        console.log(response.payload);
      });
    } else {
      navigate(-1);
    }
  }, [location.state]);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        file_status: formData.file_status,
        order_id: formData.order_id,
        order_file_id: formData.order_file_id,
        accessibilty_report_file: formData.accessibilty_report_file,
        pac_file: formData.pac_file,
        adobe_accessibility_report_file:
          formData.adobe_accessibility_report_file,
        accessibility_compliance: formData.accessibility_compliance,
        comment: formData.comment,
        chk_clr_cnst: formData.chk_clr_cnst === "Y" ? true : false,
      };
      if (values?.accessibilty_report_file === "") {
        delete values.accessibilty_report_file;
      }
      if (values?.pac_file === "") {
        delete values.pac_file;
      }
      if (values?.adobe_accessibility_report_file === "") {
        delete values.adobe_accessibility_report_file;
      }
      dispatch(updateWorkloadFile({ token, values })).then(({ payload }) => {
        if (payload.status) {
          navigate(-1);
        }
      });
    }
    setIsSubmit(false);
  }, [isSubmit]);

  const validateForm = (values) => {
    const errors = {};
    if (
      !values.accessibility_compliance &&
      file?.is_file_type_req &&
      values.file_status === complete
    ) {
      errors.accessibility_compliance = validationMsg.accComReq;
      accComplianceRef?.current?.focus();
    }
    if (values.chk_clr_cnst === "" && values.file_status === complete) {
      errors.chk_clr_cnst = validationMsg.chkClkCnstReq;
      wcagContrastRef?.current?.focus();
    }
    if (
      file?.is_file_type_req &&
      values.file_status === complete &&
      values.pac_file === "" &&
      !order_process_data?.length
    ) {
      errors.pac_file_error = validationMsg.pacFileReq;
    }
    if (
      file?.is_file_type_req &&
      values.file_status === complete &&
      values.adobe_accessibility_report_file === "" &&
      !order_process_data?.length
    ) {
      errors.acc_file_error = validationMsg.accFileReq;
    }
    if (
      values.accessibilty_report_file === "" &&
      file?.is_file_type_req &&
      values.file_status === complete &&
      !order_process_data?.length
    ) {
      errors.upload_file_error = validationMsg.uploadFileReq;
    }
    
    if (
      !file?.is_file_type_req &&
      values.accessibilty_report_file === "" &&
      values.file_status === complete
    ) {
      errors.upload_file_error = validationMsg.uploadFileReq;
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }

    return errors;
  };

  const onStatusChangeHandler = (e) => {
    const { id } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        file_status: id,
      };
    });
  };

  const onCheckBoxhandler = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  const onSubmitHandler = () => {
    setFormErrors(validateForm(formData));
  };

  const uploadFilesHandler = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => {
      return {
        ...prev,
        [name]: file,
      };
    });
  };

  const onRadioChangeHandler = (e) => {
    const { id } = e.target;
    if (id === "colorcode1") {
      setFormData((prev) => {
        return {
          ...prev,
          chk_clr_cnst: "Y",
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          chk_clr_cnst: "N",
        };
      });
    }
  };

  const inProgress = "in_progress";
  const cancel = "cancelled";
  const complete = "complete";
  return (
    <div className="main-card">
      <div className="dashboardCards">
        <Row className="align-items-center mainRow">
          <Col xs={12} sm={6} lg={6} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3">
                <dd>File Name</dd>
                <dt className="d-flex justify-content-between">
                  {file?.original_file_name ?? ""}{" "}
                  <div className="download-flie-btns">
                    <a
                      role={"link"}
                      id={file?.id}
                      href={file?.full_path}
                      className={`download-link job_button`}
                      target="_blank"
                      download={file?.original_file_name}
                      aria-labelledby={file?.original_file_name}
                    >
                      <ArrowDownLong aria-hidden="true" focusable="false" />
                      {/* Download */}
                    </a>
                  </div>
                </dt>
              </dl>
            </div>
          </Col>

          <Col xs={12} sm={6} lg={6} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3">
                <dd>Pages</dd>
                <dt>{file?.file_page_count ?? ""}</dt>
              </dl>
            </div>
          </Col>

          <Col xs={12} sm={6} lg={6} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3">
                <dd>Accessibility Compliance</dd>
                <dt>{file?.acc_complaince_level ?? ""}</dt>
              </dl>
            </div>
          </Col>

          <Col xs={12} sm={6} lg={6} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3">
                <dd>Upload Date</dd>
                <dt>{moment(file?.file_upload_date).format(dateFormat)}</dt>
              </dl>
            </div>
          </Col>

          <Col xs={12} sm={6} lg={6} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3">
                <dd>Delivery Date</dd>
                <dt>{moment(file?.file_deliver_date).format(dateFormat)}</dt>
              </dl>
            </div>
          </Col>

          <Col xs={12} sm={6} lg={6} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3">
                <dd>Status</dd>
                <dt>
                  <ul className="radio-section-list">
                    <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          disabled={
                            order_process_data?.length > 0 ? true : false
                          }
                          type="radio"
                          name="file_status"
                          id={inProgress}
                          checked={file_status === inProgress}
                          onChange={onStatusChangeHandler}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={inProgress}
                        >
                          In Progress
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          disabled={
                            order_process_data?.length > 0 ? true : false
                          }
                          type="radio"
                          name="file_status"
                          id={cancel}
                          checked={file_status === cancel}
                          onChange={onStatusChangeHandler}
                        />
                        <label className="form-check-label" htmlFor={cancel}>
                          Cancel
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="file_status"
                          id={complete}
                          checked={file_status === complete}
                          onChange={onStatusChangeHandler}
                        />
                        <label className="form-check-label" htmlFor={complete}>
                          Complete
                        </label>
                      </div>
                    </li>
                  </ul>
                </dt>
              </dl>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={12} lg={8} xl={8} className="mb-3">
            <div className="card-section">
              <div className="row" id="files_check">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="input-file mb-2">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Upload File
                    </label>
                    <input
                      disabled={file_status !== complete}
                      type="file"
                      className="form-control"
                      name="accessibilty_report_file"
                      onChange={uploadFilesHandler}
                    />
                  </div>
                  {order_process_data && order_process_data?.[0] && (
                    <div className="download-flie-btns">
                      <a
                        role={"link"}
                        id={file?.id}
                        href={
                          order_process_data?.[0] &&
                          order_process_data?.[0]?.full_path
                        }
                        className={`download-link job_button text-truncate`}
                        target="_blank"
                        download={file?.original_file_name}
                        aria-labelledby={file?.original_file_name}
                      >
                        <ArrowDownLong aria-hidden="true" focusable="false" />
                        {order_process_data?.[0] &&
                          order_process_data?.[0]?.file_name}
                      </a>
                    </div>
                  )}
                  {formErrors.upload_file_error && (
                    <span id="files_check" className="error-msg">
                      {formErrors.upload_file_error}
                    </span>
                  )}
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                  <div className="input-file mb-2">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Upload PAC 2021 Report
                    </label>
                    <input
                      disabled={file_status !== complete}
                      type="file"
                      className="form-control "
                      name="pac_file"
                      onChange={uploadFilesHandler}
                    />
                  </div>
                  {order_process_data && order_process_data?.[1] && (
                    <div className="download-flie-btns">
                      <a
                        role={"link"}
                        id={file?.id}
                        href={
                          order_process_data?.[1] &&
                          order_process_data?.[1]?.full_path
                        }
                        className={`download-link job_button text-truncate`}
                        target="_blank"
                        download={file?.original_file_name}
                        aria-labelledby={file?.original_file_name}
                      >
                        <ArrowDownLong aria-hidden="true" focusable="false" />
                        {order_process_data?.[1] &&
                          order_process_data?.[1]?.file_name}
                      </a>
                    </div>
                  )}
                  {formErrors.pac_file_error && (
                    <span id="files_check" className="error-msg">
                      {formErrors.pac_file_error}
                    </span>
                  )}
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                  <div className="input-file mb-2">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Upload Adobe Accessibility Report
                    </label>
                    <input
                      disabled={file_status !== complete}
                      type="file"
                      className="form-control"
                      name="adobe_accessibility_report_file"
                      onChange={uploadFilesHandler}
                    />
                  </div>
                  {order_process_data && order_process_data?.[2] && (
                    <div className="download-flie-btns">
                      <a
                        role={"link"}
                        id={file?.id}
                        href={
                          order_process_data?.[2] &&
                          order_process_data?.[2]?.full_path
                        }
                        className={`download-link job_button text-truncate`}
                        target="_blank"
                        download={file?.original_file_name}
                        aria-labelledby={file?.original_file_name}
                      >
                        <ArrowDownLong aria-hidden="true" focusable="false" />
                        {order_process_data?.[2] &&
                          order_process_data?.[2]?.file_name}
                      </a>
                    </div>
                  )}
                  {formErrors.acc_file_error && (
                    <span id="files_check" className="error-msg">
                      {formErrors.acc_file_error}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={12} lg={4} xl={4} className="mb-3">
            <div className="card-section">
              <dl className="cardTitle ps-3 mb-0">
                <dd>Additional Service</dd>
                <dt>
                  <span className="checkicons">
                    {file?.acc_confirmation === "Y" ? (
                      <CheckIcon />
                    ) : (
                      <Clear className="text-danger" />
                    )}
                  </span>
                  Color Contrast
                </dt>
                <dt>
                  <span className="checkicons">
                    {file?.acc_extend_alt === "Y" ? (
                      <CheckIcon />
                    ) : (
                      <Clear className="text-danger" />
                    )}
                  </span>
                  Extended Alt
                </dt>
                <dt>
                  <span className="checkicons">
                    {file?.acc_tabel_summary === "Y" ? (
                      <CheckIcon />
                    ) : (
                      <Clear className="text-danger" />
                    )}
                  </span>
                  Table Summary
                </dt>
              </dl>
            </div>
          </Col>
        </Row>

        <div className="accesbilty-section my-4">
          <h5>Additional Instruction</h5>
          <p className="additional_instruction">
            {file?.acc_additional_instruction
              ? file?.acc_additional_instruction.concat(".")
              : "N/A"}
          </p>
        </div>

        <div className="accesbilty-section my-4">
          <h5>Accessibility Compliance</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="accessibility_compliance"
              checked={formData.accessibility_compliance}
              onChange={onCheckBoxhandler}
              id="accessibility-check"
            />
            <label className="form-check-label" htmlFor="accessibility-check">
              The file has been tested to meet
              {" " + file?.acc_complaince_level ?? ""}
              Techniques with Adobe Accessibility Checker PAC Checker. A Screen
              reader user has tested the file using JAWS. We have also performed
              manual checks for reading order and image descriptions.
            </label>
          </div>
          {formErrors.accessibility_compliance && (
            <span id="accessibility-check" className="error-msg">
              {formErrors.accessibility_compliance}
            </span>
          )}
        </div>

        <div className="accesbilty-section border-top-bottom my-4 py-4">
          <h5>Color Contrast</h5>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="chk_clr_cnst"
              checked={formData?.chk_clr_cnst === "Y"}
              onChange={onRadioChangeHandler}
              id="colorcode1"
            />
            <label className="form-check-label" htmlFor="colorcode1">
              All the text in the document is checked for color contrast and it
              meets {" " + file?.acc_complaince_level ?? ""} contrast
              requirements.
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="chk_clr_cnst"
              checked={formData?.chk_clr_cnst === "N"}
              onChange={onRadioChangeHandler}
              id="colorcode2"
            />
            <label className="form-check-label" htmlFor="colorcode2">
              As per the request of the customer, we have not changed the color
              to meet the color contrast ratio.
            </label>
          </div>
          {formErrors.chk_clr_cnst && (
            <span id="colorcode1" className="error-msg">
              {formErrors.chk_clr_cnst}
            </span>
          )}
        </div>
        <p className="text-muted mb-2">
          Max length is {formData.comment.length}/300
        </p>
        <div className="textarea-section">
          <textarea
            maxLength="300"
            value={formData.comment}
            rows={3}
            className="form-control"
            placeholder="Message"
            onChange={(e) => {
              setFormData((prev) => {
                return {
                  ...prev,
                  comment: e.target.value,
                };
              });
            }}
          ></textarea>
        </div>

        <div className="save-btn my-3">
          <button
            type="button"
            className="btn btn--md button--blue"
            // disabled={
            //   formData.accessibilty_report_file === "" &&
            //   formData.pac_file === "" &&
            //   formData.adobe_accessibility_report_file === "" &&
            //   formData.file_status === complete
            // }
            onClick={onSubmitHandler}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
