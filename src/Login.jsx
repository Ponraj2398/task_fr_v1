import './Login.css'
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import Googleimg from '../src/images/googleimg.png'
// import Appleimg from '../src/images/appleimg.png'
// import loginimg from '../src/images/loginimg.png'
import loginimg from '../src/images/download.png'
import { InputGroup } from "react-bootstrap";
import { BiShow, BiHide } from "react-icons/bi";
import * as formik from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
const Login = () => {
  // const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    // setIsLogin(!isLogin);
    navigate('/signup')
  };
  const { Formik } = formik;
  const schema = yup.object().shape({
    phone: yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  });

  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const registerData = location.state?.registerData;
  console.log(registerData);
  useEffect(() => {
    if (registerData) {
      console.log("Received registration data:", registerData);
    }
  }, [registerData]);
  // const handleTogglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };
  const handleChange = (event) => {
    const { name, value } = event.target
    setLoginData({ ...loginData, [name]: value })
    console.log(name, value)
  }
  console.log(handleChange);
  const handleSubmit = async (val, { setSubmitting }) => {
    // event.preventDefault();
    // console.log("SUBMITTING FORM:", val);
    if (val.phone === '9629743994' && val.password === 'Admin@123') {
      // Perform authentication logic (e.g., set a token in localStorage)
      console.log('Admin signed in successfully!');
      navigate('/admin');
    }
    else {
      try {
        const response = await fetch("https://task-backend-v1-fkb7.onrender.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(val),
        });
        const responseData = await response.json();
        if (responseData) {
          console.log("Response data:", responseData);
          setLoginData(responseData);
          if (responseData.token) {
            localStorage.setItem("token", responseData.token);
            // During login success, set a token or flag in localStorage
            localStorage.setItem('isAuthenticated', 'true'); // Set this after successful login
            Swal.fire({
              title: "Good job!",
              text: "You are LoggedIn Successfully!",
              icon: "success"
            });
            navigate("/indexpage");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Login Failed!",
            });
          }
          
        } else {
          console.error("HTTP error:", responseData.message);
          alert(responseData.message || "Request failed");
        }
      } catch (e) {
        console.log("Error:", e);
        alert("An error occurred during login. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }

  };
  return (
    <div>
      <Container fluid className="vh-100">
        <Row className="vh-100">
          <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 1 }} className="p-0">
            <div className="signup-col vh-100">
              <img
                src={loginimg}
                className="img-fluid vh-100 vw-100"
                alt="Signup Background"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Col>
          {/* {isLogin ? ( */}
          <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 2 }} className="mt-5 d-flex flex-column justify-content-center align-items-center text-start" >
            <h1><strong>Login</strong></h1><br />
            <Formik
              validationSchema={schema}
              onSubmit={handleSubmit}
              initialValues={loginData}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form className='w-75' noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Phone no</Form.Label>
                    <Form.Control type="tel" name='phone'
                      value={values.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                      style={{ borderRadius: '25px', height: '50px', backgroundColor: '#EBEBEC' }}
                      placeholder="Enter your phone no...." required />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup >
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        style={{ borderTopLeftRadius: '25px', borderBottomLeftRadius: '25px', height: '50px', backgroundColor: '#EBEBEC' }}
                        placeholder="ex. dfishs33232$%^" required
                      />
                      <InputGroup.Text id="basic-addon1" style={{ borderTopRightRadius: '25px', borderBottomRightRadius: '25px', backgroundColor: '#EBEBEC' }}>
                        <i
                          variant="outline-dark" style={{ cursor: 'pointer' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <BiShow /> : <BiHide />}
                        </i>
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group><br />
                  <Button type='submit' className='w-100' style={{ borderRadius: '25px', height: '50px', backgroundImage: 'linear-gradient( 109.6deg,  rgba(61,145,10,1) 11.2%, rgba(28,90,88,1) 91.1% )', border: 'none' }}>Login</Button>
                </Form>
              )}
            </Formik><br />
            <p>Create a New account?&nbsp;&nbsp;<button onClick={handleToggle} style={{ textDecoration: 'none', cursor: 'pointer', border: 'none' }}><strong style={{ color: 'rgb(75,132,87)' }}>Signup</strong></button></p>
          </Col>
          {/* ) : ( */}
          {/* )} */}
        </Row>
      </Container>
    </div>
  );
};

export default Login;
