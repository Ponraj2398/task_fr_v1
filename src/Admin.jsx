import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Admin.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Container, Row, Col, Nav } from 'react-bootstrap';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSmile } from 'react-icons/fa';

function Admin() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('add');
    const navigate = useNavigate();
    // const [additems, setItems] = useState([]);
    const handleTabSelect = (tab) => {
        setActiveTab(tab);
    };

    const Redirect = () => {
        Swal.fire({
            title: "Great!",
            text: "Admin LoggedOut Successfully!",
            icon: "success"
          });
        navigate('/');
    }
    const [data, setData] = useState({
        name: '',
        price: '',
        description: '',
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://task-backend-v1-fkb7.onrender.com/api/product/list');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const handleFileChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };
    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setSelectedImage(file); // Set the selected image file
    //     }
    // };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const submitProduct = async () => {

        if (
            data.name.trim().length === 0 ||
            data.description.trim().length === 0 ||
            data.price.trim().length === 0 ||
            !selectedImage
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill all the fields!",
              });
        } else {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('image', selectedImage); // Ensure this matches your backend
                formDataToSend.append('name', data.name);
                formDataToSend.append('description', data.description);
                formDataToSend.append('price', data.price);

                const response = await axios.post('https://task-backend-v1-fkb7.onrender.com/api/product/insert', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: "Great!",
                        text: "Product Added Successfully!",
                        icon: "success"
                      });
                    fetchProducts(); // Update product list
                    setSelectedImage(null); // Reset the file input
                }
            } catch (error) {
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            }
        }
    };
    const [editProduct, setEditProduct] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        _id: ""
    });

    const handleEdit = (product) => {
        setEditProduct(product); // Set the product to edit
        setSelectedImage(null);
        handleShow(); // Show the modal
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        if (selectedImage) {
            formData.append('file', selectedImage);
        }
        formData.append('name', editProduct.name);
        formData.append('description', editProduct.description);
        formData.append('price', editProduct.price);
        formData.append('image', editProduct.image);

        try {
            const response = await fetch(`https://task-backend-v1-fkb7.onrender.com/api/product/update/${editProduct._id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something Went wrong..!",
                  });
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Data Updated: ', data);
            Swal.fire({
                title: "Great!",
                text: "Product Updated Successfully!",
                icon: "success"
              });
            fetchProducts(); // Refresh the product list
            setSelectedImage(null);
            handleClose(); // Close the modal
        } catch (error) {
            console.error('Error during fetch: ', error);
        }
    };
    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`https://task-backend-v1-fkb7.onrender.com/api/product/delete/${id}`);
            if (response.status === 200) {
                // Update the products state to remove the deleted product
                setProducts(products.filter((product) => product._id !== id));
                Swal.fire({
                    title: "Great!",
                    text: "Product Deleted Successfully!",
                    icon: "success"
                  });
                // console.log('Product deleted: ', response.data);
            } else {
                console.error('Error deleting product:', response.data);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something Went wrong..!",
                  });
            }
        } catch (error) {
            console.error('Error during deletion: ', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // var [add, setAdd] = useState();
    // add = products.filter(product =>
    //     product.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="content d-flex flex-wrap">
            <div id="admin" className="admin-main w-100">
                <div className="nav-header d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <div className="mb-3 mb-md-0">
                        {/* <Button variant="primary" className="nav-content1 fs-5">
                            Hello, <strong>Admin</strong>
                        </Button> */}
                        <span className="nav-content1 fs-5 p-2">Hello Admin &nbsp;<FaSmile className="smiley-icon"/></span>
                        <Offcanvas show={show} onHide={handleClose} backdrop={false} scroll={true}>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Edit Product</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body style={{ backgroundColor: "#435c70" }}>
                                <Form>
                                    <Form.Group className="mb-3" controlId="productName">
                                        <Form.Label className="text-warning">Product Name</Form.Label>
                                        <Form.Control type="text" name="name" value={editProduct.name || ''} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} placeholder="Enter product name" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="productDescription">
                                        <Form.Label className="text-warning">Product Description</Form.Label>
                                        <Form.Control as="textarea" name="description" value={editProduct.description || ''} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} placeholder="Enter product description" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="productPrice">
                                        <Form.Label className="text-warning">Product Price</Form.Label>
                                        <Form.Control type="text" name="price" value={editProduct.price || ''} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} placeholder="Enter product price" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="productImage">
                                        <Form.Label className="text-warning">Product Image</Form.Label>
                                        <Form.Control type="file" name="image" onChange={handleFileChange} />
                                        {selectedImage ? (
                                            <div className="text-center mt-3">
                                                <img
                                                    src={URL.createObjectURL(selectedImage)}
                                                    alt="Selected"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                                <Button variant="danger" onClick={() => setSelectedImage(null)} className="mt-2">Remove</Button>
                                            </div>
                                        ) : (
                                            editProduct.image && (
                                                <div className="text-center mt-3">
                                                    <img
                                                        src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${editProduct.image}`}
                                                        // src={`https://task-backend-v1-fkb7.onrender.com/data/uploads/${editProduct.image}`}
                                                        alt="Selected"
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </Form.Group>

                                    <div className="text-center">
                                        <Button variant="danger" onClick={handleUpdate}>Update Product</Button>
                                    </div>
                                </Form>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                    <div className="nav-content2 text-center text-md-left">
                        <p className="p fs-3 fw-bold">Box Pizza</p>
                    </div>
                    <div>
                        <Button variant="secondary" className="nav-content3" onClick={Redirect}>
                            <div className="back-btn fs-5">
                                <i className="bi bi-box-arrow-in-left text-light fw-bold"></i><span className="back">Back to Login</span>
                            </div>
                        </Button>
                    </div>
                </div>
                <Container fluid className="mt-3">
                    <Row>
                        <Col xs={12} md={2} className="mb-3 mb-md-0">
                            <ListGroup className="border shadow">
                                <Nav className="flex-column nav-pills">
                                    <ListGroup.Item>
                                        <Nav.Item>
                                            <Nav.Link active={activeTab === 'add'} onClick={() => handleTabSelect('add')}>Add New</Nav.Link>
                                        </Nav.Item>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Nav.Item>
                                            <Nav.Link active={activeTab === 'update'} onClick={() => handleTabSelect('update')}>Edit/Delete</Nav.Link>
                                        </Nav.Item>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Nav.Item>
                                            <Nav.Link active={activeTab === 'view'} onClick={() => handleTabSelect('view')}>View</Nav.Link>
                                        </Nav.Item>
                                    </ListGroup.Item>
                                </Nav>
                            </ListGroup>
                        </Col>
                        <Col xs={12} md={10}>
                            <div className="tab-content">
                                <div className={`tab-pane fade ${activeTab === 'add' && 'show active'}`} id="add-content" role="tabpanel">
                                    <Container>
                                        <Row>
                                            <Col xs={12} lg={10} xl={9} className="mb-3">
                                                <div className="a1 p-3" style={{ backgroundColor: "#435c70" }}>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title">Add Product</h2>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <Form>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label htmlFor="name" className="text-light">Product Name</Form.Label>
                                                                    <Form.Control type="text" name="name" value={data.name} onChange={handleChange} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label htmlFor="description" className="text-light">Product Description</Form.Label>
                                                                    <Form.Control as="textarea" name="description" value={data.description} onChange={handleChange} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label htmlFor="price" className="text-light">Product Price</Form.Label>
                                                                    <Form.Control type="text" name="price" value={data.price} onChange={handleChange} />
                                                                </Form.Group>
                                                            </Form>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <div className="file mt-3 mb-3">
                                                                <Form.Control
                                                                    type="file"
                                                                    name="image"
                                                                    className="text-light"
                                                                    style={{ background: '#435c70' }}
                                                                    onChange={handleFileChange}
                                                                />
                                                                {selectedImage && (
                                                                    <div className="text-center">
                                                                        <img
                                                                            alt="not found"
                                                                            width={"100%"}
                                                                            style={{ padding: '10px' }}
                                                                            src={URL.createObjectURL(selectedImage)}
                                                                        />
                                                                        <br />
                                                                        <Button variant="danger" onClick={() => setSelectedImage(null)} className="mt-2">Remove</Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} className="text-center mt-3">
                                                            <Button className="border-0 btn-color" variant="danger" onClick={submitProduct}>Add Product Now</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>

                                <div className={`tab-pane fade ${activeTab === 'update' && 'show active'}`} id="update-content" role="tabpanel">
                                    <Container>
                                        <Row>
                                            <Col xs={12} lg={10} xl={9} className="mb-3">
                                                <div className="a1 p-3">
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title">Update Product</h2>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Table striped bordered hover className="align-middle text-center">
                                                                <thead className="edit-delete-table">
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th className="edit-delete-table">Product Image</th>
                                                                        <th className="edit-delete-table">Product Name</th>
                                                                        <th className="edit-delete-table">Product Description</th>
                                                                        <th className="edit-delete-table">Product Price</th>
                                                                        <th className="edit-delete-table">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                {products.map((product, index) => (
                                                                    <tbody key={product._id} className="edit-delete-table">
                                                                        <tr>
                                                                            <td className="edit-delete-table fw-bold">{index + 1}</td>
                                                                            <td className="d-flex justify-content-center">
                                                                                <img
                                                                                    src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${product.image}`}
                                                                                    // src={`https://task-backend-v1-fkb7.onrender.com/data/uploads/${product.image}`}
                                                                                    alt="#"
                                                                                    style={{ width: '100px', height: 'auto' }}
                                                                                />
                                                                            </td>
                                                                            <td className="edit-delete-table">{product.name}</td>
                                                                            <td className="edit-delete-table">{product.description}</td>
                                                                            <td className="edit-delete-table">{product.price}</td>
                                                                            <td>
                                                                                <div>
                                                                                    <Button variant="outline-primary" title="Edit" onClick={() => handleEdit(product)}>
                                                                                        <i className="bi bi-pencil-square"></i>
                                                                                    </Button>&nbsp;&nbsp;
                                                                                    <Button variant="outline-danger" onClick={() => { deleteProduct(product._id); }} title="Delete"><i className="bi bi-trash3-fill"></i></Button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))}
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>

                                <div className={`tab-pane fade ${activeTab === 'view' && 'show active'}`} id="view-content" role="tabpanel">
                                    <Container>
                                        <Row>
                                            <Col xs={12} lg={10} xl={9} className="mb-3">
                                                <div className="a1 p-3">
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title fs-4">View All Products</h2>
                                                        </Col>
                                                        <Col xs={12} md={3} className="mt-3">
                                                            <Form.Control
                                                                type="search"
                                                                placeholder="Search products..."
                                                                value={searchQuery}
                                                                onChange={handleSearchChange}
                                                                className="mb-3"
                                                            />
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Table striped bordered hover className="align-middle text-center">
                                                                <thead className="edit-delete-table">
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th className="edit-delete-table">Product Image</th>
                                                                        <th className="edit-delete-table">Product Name</th>
                                                                        <th className="edit-delete-table">Product Description</th>
                                                                        <th className="edit-delete-table">Product Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {filteredProducts.map((product, index) => (
                                                                        <tr key={product._id}>
                                                                            <td className="edit-delete-table fw-bold">{index + 1}</td>
                                                                            <td className="d-flex justify-content-center">
                                                                                <img
                                                                                    src={`https://task-backend-v1-fkb7.onrender.com/public/data/uploads/${product.image}`}
                                                                                    // src={`https://task-backend-v1-fkb7.onrender.com/data/uploads/${product.image}`} 
                                                                                    alt="Product" style={{ width: '100px', height: 'auto' }} />
                                                                            </td>
                                                                            <td className="edit-delete-table">{product.name}</td>
                                                                            <td className="edit-delete-table">{product.description}</td>
                                                                            <td className="edit-delete-table">{product.price}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>



    );
}

export default Admin;