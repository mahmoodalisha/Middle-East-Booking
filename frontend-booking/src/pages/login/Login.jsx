import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import { AuthContext } from "../../context/AuthContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

const Login = () => {
  const apiBase = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="register-container">
      <h2>Login</h2>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          setErrorMessage("");

          dispatch({ type: "LOGIN_START" });

          try {
            const response = await axios.post(
              `${apiBase}/api/auth/login`,
              values
            );

            const userData = response.data;

            const user = {
              username: userData.username,
              email: userData.details.email,
              id: userData.details._id,
              token: userData.token,
            };

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", userData.token);
            localStorage.setItem("userId", userData.details._id);

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: user,
            });

            navigate("/");
          } catch (error) {
            dispatch({
              type: "LOGIN_FAILURE",
              payload: "Invalid email or password",
            });

            setErrorMessage("Login failed. Please check your credentials.");
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <label>Email</label>
              <Field name="email" type="email" />
              {errors.email && touched.email && <div>{errors.email}</div>}
            </div>

            <div>
              <label>Password</label>
              <Field name="password" type="password" />
              {errors.password && touched.password && (
                <div>{errors.password}</div>
              )}
            </div>

            {errorMessage && <div>{errorMessage}</div>}

            <button type="submit">Login</button>
          </Form>
        )}
      </Formik>

      <p>
        Forgot your password? <a href="/forgot-password">Reset here</a>
      </p>

      <p>
        New user? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;