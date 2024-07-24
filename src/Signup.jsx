import './Login.css'
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Googleimg from '../src/images/googleimg.png'
import Appleimg from '../src/images/appleimg.png'
import loginimg from '../src/images/download.png'
import { InputGroup } from "react-bootstrap";
import { BiShow, BiHide } from "react-icons/bi";
import * as formik from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
const SignUpForm = () => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    const handleToggle = () => {
        // setIsLogin(!isLogin);
        navigate('/');
    };
    const { Formik } = formik;
    const schema = yup.object().shape({
        phone: yup.string()
            .required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
        name: yup.string().required('Name is required'),
        password: yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    });

    const [registerData, setRegisterData] = useState({
        phone: "",
        name: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (val, { setSubmitting }) => {
        // event.preventDefault();
        console.log("SUBMITTING FORM:", val);
        try {
            const response = await fetch("http://localhost:8080/register/add", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "post",
                body: JSON.stringify(val),
            });
            const responseData = await response.json();
            if (responseData) {
                console.log("the Fectched data is", responseData);
                setRegisterData(responseData);
                alert('SignUp Successfull....')
                navigate("/",{ state: { registerData: responseData } });
            } else {
                alert("Phone no is already exists");
            }
        } catch (e) {
            console.log("error", e);
        }
        setSubmitting(false);
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
                    {/* ) : ( */}
                        <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 2 }} className="mt-5 d-flex flex-column justify-content-center align-items-center text-start">
                            <h1><strong>Sign up</strong></h1><br />
                            <Formik
                                validationSchema={schema}
                                onSubmit={handleSubmit}
                                initialValues={{
                                    phone: "",
                                    name: "",
                                    password: "",
                                }}
                            >
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
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
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={!!errors.name}
                                                style={{ borderRadius: '25px', height: '50px', backgroundColor: '#EBEBEC' }}
                                                placeholder="Enter your name.." required />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
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
                                        </Form.Group>
                                        <br />
                                        <p style={{ fontSize: '14px' }}>
                                            By registering for an account, you are consenting to our <u style={{ color: 'blue' }}>Terms of Service</u> and confirming that you have reviewed and accepted the <span style={{ color: 'blue' }}>Global Privacy Statement.</span>
                                        </p>
                                        <Button type='submit' className='w-100' style={{ borderRadius: '25px', height: '50px', backgroundImage: 'linear-gradient( 109.6deg,  rgba(61,145,10,1) 11.2%, rgba(28,90,88,1) 91.1% )', border: 'none' }}>Get started free</Button>
                                    </Form>
                                )}
                            </Formik>
                            <br />
                            <p>Already have an account? <a onClick={handleToggle} style={{ textDecoration: 'none',cursor:'pointer' }}><strong style={{ color: 'rgb(75,132,87)' }}>Login</strong></a></p><br />
                            <Button className='w-75' style={{ borderRadius: '25px', height: '50px', backgroundColor: '#fff', color: 'black', border: '1px solid grey' }}><img src={Googleimg} width='30' height='30' alt='not found' />&nbsp;&nbsp;<span style={{ fontSize: '18px' }}>Continue with Google</span></Button><br />
                            <Button className='w-75 mb-4' style={{ borderRadius: '25px', height: '50px', backgroundColor: '#fff', color: 'black', border: '1px solid grey' }}><img src={Appleimg} width='25' height='30' alt='not found' />&nbsp;&nbsp;<span style={{ fontSize: '18px', }}>Continue with Apple</span></Button>
                        </Col>
                    {/* )} */}
                </Row>
            </Container>
        </div>
    );
};

export default SignUpForm;
