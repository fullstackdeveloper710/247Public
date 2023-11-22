import React, { useEffect, useRef, useState } from "react";
import "./ManageHolidays.scss";
import { Col, Row } from "react-bootstrap";
import Button from "components/Button";
import Input from "components/inputField";
import SelectBox from "components/SelectBox/SelectBox";
import { Calendar } from "assets/images";
import ManageHolidaysTable from "./ManageHolidaysTable";
import { MANAGE_HOLIDAYS } from "constants/title";
import { useDispatch, useSelector } from "react-redux";
import {
  createHoliday,
  fetchHolidayList,
  updateHoliday,
} from "redux/asyncApi/userApi";
import CustomCalendar from "components/Calender";
import moment from "moment";
import { dateFormat } from "util/helpers";
import { validationMsg } from "util/validationErrors";

const ManageHolidays = () => {
  document.title = MANAGE_HOLIDAYS;
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);
  const { get_holidays } = useSelector((state) => state.user) || {};
  const { data } = get_holidays || {};
  const [formData, setFormData] = useState({
    holiday: "",
    date: "",
    day: "",
    status: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [label, setLabel] = useState("create");
  const [dataById, setDataById] = useState();

  const holidayRef = useRef();
  const dateRef = useRef();
  const dayRef = useRef();
  const statusRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataById) {
      setFormData((prev) => {
        return {
          ...prev,
          holiday: dataById.holiday_name,
          date: dataById?.date ? new Date(dataById.date) : "",
          day: dataById.day,
          status: dataById.status,
        };
      });
    }
  }, [dataById]);

  useEffect(() => {
    if (isSubmit) {
      let values = {
        day: formData.day,
        holiday_name: formData.holiday,
        date: moment(formData.date).format("YYYY-MM-DD"),
        status: formData.status,
      };
      if (label === "create") {
        dispatch(createHoliday({ token, values })).then(({ payload }) => {
          if (payload.status) {
            dispatch(fetchHolidayList(token));
            setFormData({
              holiday: "",
              date: "",
              day: "",
              status: "",
            });
          }
        });
      } else {
        values.id = dataById.id;
        dispatch(updateHoliday({ token, values })).then(({ payload }) => {
          if (payload.status) {
            dispatch(fetchHolidayList(token));
            setFormData({
              holiday: "",
              date: "",
              day: "",
              status: "",
            });
            setLabel("create");
          }
        });
      }
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

  const validateForm = (values) => {
    const errors = {};
    if (values.status === "") {
      errors.status = validationMsg.statusReq;
      statusRef?.current?.focus();
    }
    if (values.date === "") {
      errors.date = validationMsg.dateReq;
      dateRef?.current?.focus();
    }
    if (values.holiday === "") {
      errors.holiday = validationMsg.holidayReq;
      holidayRef?.current?.focus();
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const onSubmitHandler = (e) => {
    setFormErrors(validateForm(formData));
  };

  const onChangeHandler = (date) => {
    setFormData((prev) => {
      return {
        ...prev,
        date: date,
        day: date?.toLocaleDateString(undefined, { weekday: "long" }) ?? "",
      };
    });
  };
  const { holiday, date, day, status } = formData;
  return (
    <>
      <div className="manageHoliday">
        <div className="manageHoliday__card">
          <div className="manageHoliday__card__header">
            <h2 className="mainTitle mb-0" id="table_info">Holiday List</h2>
          </div>
          <div className="manageHoliday__card__content p-0">
            <ManageHolidaysTable
              setLabel={setLabel}
              setDataById={setDataById}
            />
          </div>
        </div>

        <div className="manageHoliday__card">
          <div className="manageHoliday__card__header">
            <h2 className="mainTitle mb-0">Add Holidays</h2>
          </div>
          <div className="manageHoliday__card__content">
            <Row>
              <Col md="6">
                <Input
                  type="text"
                  ref={holidayRef}
                  autoComplete="off"
                  label="Holiday:"
                  required={false}
                  forLabel={"holiday"}
                  name="holiday"
                  value={holiday}
                  error={formErrors.holiday ? true : false}
                  errorMsg={formErrors.holiday}
                  // onFocus={onFocus}
                  onInputChange={onInputChange}
                />
              </Col>
              <Col md="6">
                <CustomCalendar
                  label="Date:"
                  type="date"
                  autoComplete="off"
                  placeholder="DD/MM/YYYY"
                  // ref={dateRef}
                  required={false}
                  icon={<Calendar />}
                  forLabel={"date"}
                  name="date"
                  value={date}
                  error={formErrors.date ? true : false}
                  errorMsg={formErrors.date}
                  // onFocus={onFocus}
                  excludeDates={data?.map((item) => new Date(item.date)) ?? []}
                  onChangeHandler={onChangeHandler}
                />
              </Col>
              <Col md="6">
                <Input
                  disabled={true}
                  type="text"
                  autoComplete="off"
                  label="Day:"
                  required={false}
                  forLabel={"day"}
                  ref={dayRef}
                  name="day"
                  value={day}
                  error={formErrors.day ? true : false}
                  errorMsg={formErrors.day}
                  // onFocus={onFocus}
                  onInputChange={onInputChange}
                />
              </Col>
              <Col md="6">
                <SelectBox
                  className="form-control form-select"
                  onChange={onInputChange}
                  name="status"
                  value={status}
                  options={[
                    { value: "cancelled", label: "cancelled" },
                    { value: "confirmed", label: "confirmed" },
                  ]}
                  error={formErrors.status ? true : false}
                  errorMsg={formErrors.status}
                  label={"Status:"}
                />
              </Col>
              <Col md="12">
                <div className="manageHoliday-buttons d-flex align-items-center justify-content-end">
                  <Button
                    title={label === "create" ? "Save" : "Update"}
                    className={"button--blue ms-3"}
                    onClick={onSubmitHandler}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageHolidays;
