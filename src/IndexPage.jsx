import './Login.css'
import React, { useState } from 'react';
import { Container, Row, Col, Button, Offcanvas, Nav,Form, Alert } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

const IndexPage = () => {
   const [showSidebar, setShowSidebar] = useState(false);

   const handleToggleSidebar = () => setShowSidebar(!showSidebar);
   const [activeButton, setActiveButton] = useState('Templates');

   const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
   };
   const [activeTab, setActiveTab] = useState('Templates');
   const handleTabSelect = (tab) => {
      setActiveTab(tab);
   };
   // Search Query
   const [searchQuery, setSearchQuery] = useState('');
   const [additems, setItems] = useState([]);
   const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
   };
   var [add, setAdd] = useState();
   add = additems.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const [errorMessage, setErrorMessage] = useState('');
   const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === 'text/html') {
         setFile(selectedFile);
         setErrorMessage('');
      } else {
         setFile(null);
         setErrorMessage('Only .html files are allowed.');
      }
   };
   const [file, setFile] = useState(null);
   const createTemplate = async (event) => {
      event.preventDefault();
      if (!file) {
         alert("Please select a file to upload.");
         return;
      }
      try {
         const formData = new FormData();
         formData.append('file', file);
         const userToken = localStorage.getItem("token");
         const response = await fetch('https://contentcrafter.bulkpe.in/api/CreateTemplate', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${userToken}`
            },
            body: formData
         });

         if (!response.ok) {
            throw new Error('Network response was not ok');
         }

         const data = await response.json();
         console.log('Success:', data);
         alert("Upload Successful...");
         handleClose();
      } catch (error) {
         console.error('Error:', error);
      }
   };
   return (
      <div>
         <Container fluid className="vh-100">
            <Row className="vh-100">
               <Col xs={12} md={2} className="d-none d-md-block" style={{ backgroundColor: 'rgb(58,58,58)' }}>
                  {/* Sidebar content */}
                  <div style={{ color: 'white' }} className='mt-5 d-flex flex-column justify-content-center align-items-center'>
                     <h2>Logo</h2>
                     <Container fluid className="h-100 text-center mt-5" style={{ fontSize: '22px' }}>
                        <Row>
                           {/* <ListGroup>
                              <Nav className="flex-column"> */}
                           <Col xs={12} className='mb-4'>
                              <ListGroup.Item>
                                 <Nav.Item className='w-100'>
                                    <Nav.Link
                                       active={activeTab === 'Templates'}
                                       onClick={() => handleTabSelect('Templates')}
                                       style={{ borderRadius: '20px', color: 'white', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 'Templates' ? 'rgb(122, 182, 66)' : 'rgb(58,58,58)', border: 'none' }}>
                                       Templates
                                    </Nav.Link>
                                 </Nav.Item>
                              </ListGroup.Item>
                           </Col>
                           <Col xs={12} className='mb-4'>
                              <ListGroup.Item>
                                 <Nav.Item className='w-100'>
                                    <Nav.Link
                                       active={activeTab === 'Pages'}
                                       onClick={() => handleTabSelect('Pages')}
                                       style={{ borderRadius: '20px', color: 'white', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 'Pages' ? 'rgb(122, 182, 66)' : 'rgb(58,58,58)', border: 'none' }}>
                                       Pages
                                    </Nav.Link>
                                 </Nav.Item>
                              </ListGroup.Item>
                           </Col>
                           <Col xs={12} className='mb-4'>
                              <ListGroup.Item>
                                 <Nav.Item className='w-100'>
                                    <Nav.Link
                                       active={activeTab === 'Settings'}
                                       onClick={() => handleTabSelect('Settings')}
                                       style={{ borderRadius: '20px', color: 'white', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 'Settings' ? 'rgb(122, 182, 66)' : 'rgb(58,58,58)', border: 'none' }}>
                                       Settings
                                    </Nav.Link>
                                 </Nav.Item>
                              </ListGroup.Item>
                           </Col>
                           {/* </Nav>
                           </ListGroup> */}
                        </Row>
                     </Container>
                  </div>

               </Col>
               <Col xs={12} md={10} className="bg-white mt-2">
                  {/* Content page */}

                  <Button className="d-block d-md-none" variant="outline-primary" style={{ float: 'left' }} onClick={handleToggleSidebar}>
                     <i className="bi bi-list"></i>
                  </Button>
                  &nbsp;&nbsp;<strong className="d-block d-md-none" style={{ fontSize: '25px' }}>Logo</strong><br />
                  <div className="tab-content" >
                     <div className={`tab-pane fade ${activeTab === 'Templates' && 'show active'}`} id="templates-content" role="tabpanel">
                        <Container fluid className='w-100'>
                           <Row>
                              <Col xs={4} md={2}>
                              </Col>
                              <Col xs={8} md={10} className="d-flex justify-content-end align-items-center">
                                 <div style={{ marginRight: '50px' }}><Button style={{ borderRadius: '20px', width: '100px' }} onClick={handleShow}>Upload</Button></div>&nbsp;&nbsp;
                                 {/* <div><input
                                 type="search"
                                 className='w-50'
                                 placeholder="Search templates..."
                                 value={searchQuery}
                                 onChange={handleSearchChange}
                                 style={{ marginRight:'150px',height: '38px', borderRadius: '20px', border: '2px solid grey' }}
                              />
                              </div> */}
                              </Col>
                           </Row>
                        </Container>
                        <Modal show={show} onHide={handleClose}>
                           <Modal.Header closeButton>
                              <Modal.Title>Upload a file</Modal.Title>
                           </Modal.Header>
                           <Modal.Body>
                              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                              <Form onSubmit={createTemplate}>
                                 <Form.Group controlId="formFile" className="mb-3">
                                    {/* <Form.Label>Upload File</Form.Label> */}
                                    <Form.Control type="file" onChange={handleFileChange} />
                                 </Form.Group>
                                 <div className='d-flex justify-content-center'><Button className='w-25' variant="primary" type="submit">
                                    Upload
                                 </Button> &nbsp;&nbsp;
                                 <Button className='w-25' variant="outline-primary" type="reset">
                                    Reset
                                 </Button>
                                 </div>
                              </Form>
                           </Modal.Body>
                        </Modal>
                        <br />
                        <Container fluid>
                           <Row>
                              <Col xs={12} className='mb-3'>
                                 <h3>Templates</h3>
                              </Col>
                              <Col xs={12}>
                                 Template Lists
                              </Col>
                           </Row>
                        </Container>


                     </div>
                     <div className={`tab-pane fade ${activeTab === 'Pages' && 'show active'}`} id="pages-content" role="tabpanel">
                        <p>Pages Content</p>
                     </div>
                     <div className={`tab-pane fade ${activeTab === 'Settings' && 'show active'}`} id="settings-content" role="tabpanel">
                        <p>Settings Content</p>
                     </div>
                  </div>
               </Col>
            </Row>
            <Offcanvas show={showSidebar} onHide={handleToggleSidebar} placement="end" style={{ backgroundColor: 'rgb(58,58,58)', color: 'white' }}>
               <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Sidebar</Offcanvas.Title>
               </Offcanvas.Header>
               <Offcanvas.Body>
                  {/* Sidebar content for mobile */}
                  <div style={{ color: 'white' }} className='mt-5 d-flex flex-column justify-content-center align-items-center'>
                     <h2>Logo</h2>
                     <Container fluid className="vh-100 text-center mt-5" style={{ fontSize: '22px' }}>
                        <Row>
                           {/* <ListGroup>
                              <Nav className="flex-column"> */}
                           <Col xs={12} className='mb-4'>
                              <ListGroup.Item>
                                 <Nav.Item className='w-100'>
                                    <Nav.Link
                                       active={activeTab === 'Templates'}
                                       onClick={() => handleTabSelect('Templates')}
                                       style={{ borderRadius: '20px', color: 'white', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 'Templates' ? 'rgb(122, 182, 66)' : 'rgb(58,58,58)', border: 'none' }}>
                                       Templates
                                    </Nav.Link>
                                 </Nav.Item>
                              </ListGroup.Item>
                           </Col>
                           <Col xs={12} className='mb-4'>
                              <ListGroup.Item>
                                 <Nav.Item className='w-100'>
                                    <Nav.Link
                                       active={activeTab === 'Pages'}
                                       onClick={() => handleTabSelect('Pages')}
                                       style={{ borderRadius: '20px', color: 'white', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 'Pages' ? 'rgb(122, 182, 66)' : 'rgb(58,58,58)', border: 'none' }}>
                                       Pages
                                    </Nav.Link>
                                 </Nav.Item>
                              </ListGroup.Item>
                           </Col>
                           <Col xs={12} className='mb-4'>
                              <ListGroup.Item>
                                 <Nav.Item className='w-100'>
                                    <Nav.Link
                                       active={activeTab === 'Settings'}
                                       onClick={() => handleTabSelect('Settings')}
                                       style={{ borderRadius: '20px', color: 'white', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 'Settings' ? 'rgb(122, 182, 66)' : 'rgb(58,58,58)', border: 'none' }}>
                                       Settings
                                    </Nav.Link>
                                 </Nav.Item>
                              </ListGroup.Item>
                           </Col>
                        </Row>
                     </Container>
                  </div>
               </Offcanvas.Body>
            </Offcanvas>
         </Container>
      </div>
   )
}
export default IndexPage;