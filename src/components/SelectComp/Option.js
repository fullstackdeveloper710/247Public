import { Clear, EditIcon, Update } from "assets/images";
import React, { useRef, useState } from "react";

const Option = ({
  id,
  setIsOpen,
  label,
  className,
  setSelectedValue,
  selectedValue,
  editDepartmentHandler,
}) => {
  const [edit, setEdit] = useState({ label });
  const [showEdit, setShowEdit] = useState(false);

  const editRef = useRef();
  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };

  const onEditChangeHandler = (e) => {
    e.preventDefault();
    setEdit({ id: e.target.id, label: e.target.value });
  };

  const onEditClickHandler = (e) => {
    setShowEdit(true);
    setIsOpen(true);
  };

  const onUpdateHandler = () => {
    setShowEdit(false);
    editDepartmentHandler(edit);
  };

  const onEditCancelHandler = () => {
    setShowEdit(false);
    setEdit({ label });
  };
  return (
    <li
      aria-labelledby="department"
      key={label}
      className={`custom-option ${className || ""} ${
        label === selectedValue ? "selection" : ""
      }`}
      data-value={label}
      onClick={() => handleOptionClick(label)}
    >
      {showEdit ? (
        <div className="option-group">
          <input
            type="text"
            id={id}
            value={edit?.label}
            onChange={onEditChangeHandler}
          />
          <button
            type="button"
            className="updateIcon"
            onClick={onUpdateHandler}
          >
            <Update aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="cancelIcon"
            onClick={onEditCancelHandler}
          >
            <Clear aria-hidden="true" focusable="false" />
          </button>
        </div>
      ) : (
        <div className="option-group">
          <span>{label}</span>
          <button
            ref={editRef}
            type="button"
            className="editIcon"
            onClick={onEditClickHandler}
          >
            <EditIcon aria-hidden="true" focusable="false" />
          </button>
        </div>
      )}
    </li>
  );
};

export default Option;
