import React from "react";
import Select from "react-select";

const CustomReactSelect = ({
  onSelectHandler,
  data,
  defaultValue,
  disabled,
  value,
  className,
  showOptionBadge,
  isClearable
}) => {
const customStyles = {
  option: (provided) => ({
    ...provided,
  }),
};
const formatOptionLabel = ({ innerProps, label, orders_count,isSelected,isFocused }) => (
  <div  {...innerProps} className="option_comp">
    {label}
    {showOptionBadge && orders_count >= 0 && (
      <span className="select-badge">{orders_count}</span>
    )}
  </div>
);
  return (
    <Select
      className={className}
      isDisabled={disabled}
      defaultValue={defaultValue}
      value={value}
      onChange={onSelectHandler}
      options={data}
      formatOptionLabel={formatOptionLabel}
      // styles={customStyles}
      isClearable={isClearable}
    />
  );
};

export default CustomReactSelect;
