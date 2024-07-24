import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle payment processing here
        console.log('Payment submitted');
        navigate('/confirmation'); // Navigate to a confirmation page after payment
    };

    return (
        <Container className="payment-container">
            <h2 className="text-center">Payment Page</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="cardName">
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" required />
                </Form.Group>

                <Form.Group controlId="cardNumber">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter card number" required />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group controlId="expiryDate">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control type="text" placeholder="MM/YY" required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="cvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" placeholder="CVV" required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="billingAddress">
                    <Form.Label>Billing Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter billing address" required />
                </Form.Group>

                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Pay Now
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Payment;
