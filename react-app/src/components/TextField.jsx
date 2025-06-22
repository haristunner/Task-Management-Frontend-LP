import React from "react";
import { Input } from "antd";

const TextField = ({
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
        {type === "Password" ? (
          <Input.Password
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            status={error && "error"}
            size="large"
          />
        ) : (
          <Input
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            status={error && "error"}
            size="large"
          />
        )}
        {error ? <p className="textfield_error_text">{error_text}</p> : ""}
      </div>
    </div>
  );
};

export default TextField;
