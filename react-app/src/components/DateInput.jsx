import React from "react";
import { DatePicker } from "antd";

const DateInput = ({
  name = "",
  label = "",
  value = "",
  onChange,
  error = false,
  error_text = "",
  placeholder = "",
  type = "",
}) => {
  return (
    <div className="textfield">
      <label htmlFor={name}>{label}</label>
      <div>
        <DatePicker
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          status={error && "error"}
          size="large"
          showTime
          style={{ width: "100%" }}
        />
        {error ? <p className="textfield_error_text">{error_text}</p> : ""}
      </div>
    </div>
  );
};

export default DateInput;
