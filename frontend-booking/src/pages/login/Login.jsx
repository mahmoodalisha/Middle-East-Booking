import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import "./Login.css";


const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

const Login = () => {
  const apiBase = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="register-container">
      <h2>Login</h2>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          setErrorMessage("");

          try {
            const response = await axios.post(
              `${apiBase}/api/auth/login`,
              values
            );

            if (response.status === 200) {
              const userData = response.data;
              console.log("JWT Token:", userData.token);
              localStorage.setItem("token", userData.token);
              localStorage.setItem("userId", userData.details._id);
              localStorage.setItem("user", JSON.stringify(userData.details));
              localStorage.setItem("username", userData.username);

              dispatch(setUser({
              username: userData.username,
              email: userData.details.email,
              id: userData.details._id,
              }));
              // Store in Redux
              navigate("/"); // Redirect to homepage
            }
          } catch (error) {
            console.error("Login failed:", error);
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
