import React, { useState } from "react";
import Logo from "../assets/logo.png";
import TextField from "../components/TextField";
import { Checkbox, Flex, message } from "antd";
import axios from "axios";
import { SERVER_BASE_URL } from "../config/vars";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Auth = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [page, setPage] = useState("signup");
  const [data, setData] = useState({
    email: undefined,
    password: undefined,
    confirm_password: undefined,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleClick = async () => {
    if (page === "signup") {
      if (
        !data?.email ||
        !emailRegex.test(data?.email) ||
        !data.password ||
        data.password?.length < 8 ||
        !data.confirm_password ||
        data.confirm_password !== data.password
      ) {
        return;
      }

      await axios
        .post(`${SERVER_BASE_URL}/auth/register`, {
          email: data?.email,
          password: data?.password,
        })
        .then((response) => {
          if (!response.data?.success) {
            return messageApi.error(response?.data?.message);
          }

          setData({
            email: undefined,
            password: undefined,
            confirm_password: undefined,
          });
          setPage("signin");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (!data?.email || !emailRegex.test(data?.email) || !data.password) {
        return;
      }

      await axios
        .post(
          `${SERVER_BASE_URL}/auth/login`,
          {
            email: data?.email,
            password: data?.password,
          },
          { withCredentials: true }
        )
        .then((response) => {
          if (!response.data?.success) {
            return messageApi.error(response?.data?.message);
          }

          const { user_id, access_token } = response.data?.data;
          window.localStorage.setItem("userId", user_id);
          window.localStorage.setItem("accessToken", access_token);
          return navigate("/task");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="app">
      {contextHolder}

      <div className="logo">
        <img src={Logo} alt="Logo" loading="lazy" />
      </div>

      <div className="auth_cont">
        <section className="section_1">
          <p>Join 1000* Business</p>
          <p className="col_yellow">Powering Growth with</p>
          <p>Lemonpay!</p>
        </section>

        {page === "signup" ? (
          <section className="section_2">
            <div className="section_2_desc">
              <h2>Welcome Sign Up System</h2>

              <p>Your gateway to seamless</p>
              <p>transactions and easy payments.</p>
            </div>

            <Flex vertical gap={8}>
              <TextField
                name="email"
                label="Email"
                placeholder="mahadev@lemonpay.tech"
                value={data.email}
                onChange={handleChange}
                error={
                  data?.email === "" || data?.email
                    ? !emailRegex.test(data?.email)
                    : false
                }
                error_text={
                  data?.email === ""
                    ? "This field is required"
                    : data?.email && !emailRegex.test(data?.email)
                    ? "Please enter valid email"
                    : ""
                }
              />

              <TextField
                type="Password"
                name="password"
                label="Password"
                placeholder="Min 8 characters"
                value={data.password}
                onChange={handleChange}
                error={data.password === "" || data.password?.length < 8}
                error_text={
                  data.password === ""
                    ? "This field is required"
                    : data.password?.length < 8
                    ? "Password must be at least 8 characters"
                    : ""
                }
              />

              <TextField
                type="Password"
                name="confirm_password"
                label="Confirm Password"
                placeholder="Min 8 characters"
                value={data.confirm_password}
                onChange={handleChange}
                error={
                  data.confirm_password === "" ||
                  data.confirm_password !== data.password
                }
                error_text={
                  data.confirm_password === ""
                    ? "This field is required"
                    : data.confirm_password !== data.password
                    ? "Passwords do not match"
                    : ""
                }
              />

              <Flex justify="space-between">
                <Checkbox>Remember me</Checkbox>

                <p
                  className="auth_anchor"
                  onClick={() => {
                    setPage("signin");
                    setData({
                      email: undefined,
                      password: undefined,
                      confirm_password: undefined,
                    });
                  }}
                >
                  Sign In
                </p>
              </Flex>

              <button className="auth_btn" onClick={handleClick}>
                Sign Up
              </button>
            </Flex>
          </section>
        ) : (
          <section className="section_2">
            <div className="section_2_desc">
              <h2>Welcome Login System</h2>

              <p>Your gateway to seamless</p>
              <p>transactions and easy payments.</p>
            </div>

            <Flex vertical gap={8}>
              <TextField
                name="email"
                label="Email"
                placeholder="mahadev@lemonpay.tech"
                value={data.email}
                onChange={handleChange}
                error={
                  data?.email === "" || data?.email
                    ? !emailRegex.test(data?.email)
                    : false
                }
                error_text={
                  data?.email === ""
                    ? "This field is required"
                    : data?.email && !emailRegex.test(data?.email)
                    ? "Please enter valid email"
                    : ""
                }
              />

              <TextField
                type="Password"
                name="password"
                label="Password"
                placeholder="Min 8 characters"
                value={data.password}
                onChange={handleChange}
                error={data.password === ""}
                error_text={
                  data.password === "" ? "This field is required" : ""
                }
              />

              <Flex justify="space-between">
                <Checkbox>Remember me</Checkbox>

                <p
                  className="auth_anchor"
                  onClick={() => {
                    setPage("signup");
                    setData({
                      email: undefined,
                      password: undefined,
                      confirm_password: undefined,
                    });
                  }}
                >
                  Sign Up
                </p>
              </Flex>

              <button className="auth_btn" onClick={handleClick}>
                Sign In
              </button>
            </Flex>
          </section>
        )}
      </div>
    </div>
  );
};

export default Auth;
