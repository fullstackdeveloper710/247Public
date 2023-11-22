import React, { useEffect, useState } from "react";
import Option from "./Option";
import { AddIcon, Clear } from "assets/images";
import "./select.scss";

const SelectComponent = React.forwardRef((props, ref) => {
  const {
    options,
    placeholder,
    addNewOptionHandler,
    editDepartmentHandler,
    selectedDepartment,
    userDepartment,
    forLabel,
    label,
    required,
    role,
    ErrorLabel,
    errorMsg,
    name,
    autoComplete,
    type,
    onChange,
    accept,
    onFocus,
    error,
    readOnly,
    onInputChange,
    isOpen,
    setIsOpen,
    ...rest
  } = props;

  const [selectedValue, setSelectedValue] = useState("Main");
  const [showAdd, setShowAdd] = useState(false);
  const [addOption, setAddOption] = useState("");

  //Methods
  useEffect(() => {
    selectedDepartment(selectedValue);
  }, [selectedValue]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const onCancelHandler = () => {
    setShowAdd(false);
  };

  const onAddHandler = () => {
    setShowAdd(true);
  };

  const onAddChangeHandler = (e) => {
    setAddOption(e.target.value);
  };

  const addNewOption = () => {
    setShowAdd(false);
    addNewOptionHandler(addOption);
  };

  const onKeyDownHandler = (e) => {
    const { key } = e;
    if (key === "Enter") {
      setIsOpen(true);
    }
    if (key === "Escape") {
      setIsOpen(false);
    }
  };

  const onBlurHandler = () => {
    // if(showAdd){
    //   setIsOpen(false);
    // }
  };

  return (
    <div
      className={`inputRow  custom-select ${error && `error-row`} ${
        isOpen ? "opened" : ""
      }`}
      id="department"
    >
      <label htmlFor={forLabel} className="mb-2" role={role}>
        {label}
        {required && <sup className="text-danger">*</sup>}{" "}
      </label>
      <div
        className="custom-select-trigger form-control"
        onClick={handleToggleDropdown}
        onKeyDown={onKeyDownHandler}
        onBlur={onBlurHandler}
      >
        <input
          className="select_input form-control"
          readOnly={readOnly}
          value={
            userDepartment
              ? userDepartment
              : selectedValue
              ? selectedValue
              : placeholder
          }
          ref={ref}
          aria-describedby={error ? ErrorLabel : null}
          id={forLabel}
          autoComplete={autoComplete}
          type={type}
          // onChange={(e) => onInputChange(e, name)}
          accept={accept}
          placeholder={placeholder}
          name={name}
          onFocus={onFocus}
          {...rest}
        />
      </div>
      {error && (
        <span className="error-msg" id={ErrorLabel}>
          {errorMsg}
        </span>
      )}
      <div className="custom-options">
        <ul>
          {options.length > 0 ? (
            options.map((option, index) => (
              <Option
                key={index}
                id={option.id}
                label={option.label}
                setIsOpen={setIsOpen}
                className={""}
                setSelectedValue={setSelectedValue}
                selectedValue={selectedValue}
                editDepartmentHandler={editDepartmentHandler}
              />
            ))
          ) : (
            <li className="no-option">no option </li>
          )}
        </ul>
        <div className="list-footer">
          {showAdd ? (
            <div className="selectlist">
              <input
                type="text"
                placeholder="Enter text..."
                value={addOption}
                onChange={onAddChangeHandler}
              />
              <button
                type="button"
                className="updateIcon"
                onClick={addNewOption}
              >
                <AddIcon aria-hidden="true" focusable="false" />
              </button>
              <button
                type="button"
                className="cancelIcon"
                onClick={onCancelHandler}
              >
                <Clear aria-hidden="true" focusable="false" />
              </button>
            </div>
          ) : (
            <button type="button" className="addButton" onClick={onAddHandler}>
              Add New
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default SelectComponent;