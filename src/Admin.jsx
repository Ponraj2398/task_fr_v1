import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Admin.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Container, Row, Col, Nav } from 'react-bootstrap';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';

function Admin() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('add');
    const navigate = useNavigate();
    const [additems, setItems] = useState([]);
    const handleTabSelect = (tab) => {
        setActiveTab(tab);
    };
    // const [update, setUpdate] = useState({
    //     valId: "",
    //     valName: "",
    //     valPrice: "",
    //     valDescription: "",
    //     valImage: "",
    // })

    var [count, setCount] = useState(1);
    var [count1, setCount1] = useState(1)
    var [count2, setCount1] = useState(1)
    const Redirect = () => {
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
            const response = await axios.get('http://localhost:8080/api/product/list');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const handleFileChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
        setSearchQuery(event.target.value);
    };

    const submitProduct = async () => {

        if (
            data.name.trim().length === 0 ||
            data.description.trim().length === 0 ||
            data.price.trim().length === 0 ||
            !selectedImage
        ) {
            alert("Please fill all the fields");
        } else {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('file', selectedImage);
                formDataToSend.append('name', data.name);
                formDataToSend.append('description', data.description);
                formDataToSend.append('price', data.price);
                const response = await axios.post('http://localhost:8080/api/product/insert', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                fetchProducts();
                alert("Product Added");
                setSelectedImage(null);
                window.location.reload();
            } catch (error) {
                console.error('Error adding product:', error);
            }
        }
        // } else {
        //     console.error('Image upload failed. Product not added.');
        // }
    };
    // const [id, setId] = useState(null)
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
            const response = await fetch(`http://localhost:8080/api/product/update/${editProduct._id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log('Data Updated: ', data);
            fetchProducts(); // Refresh the product list
            setSelectedImage(null);
            handleClose(); // Close the modal
        } catch (error) {
            console.error('Error during fetch: ', error);
        }
    };
    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/product/delete/${id}`);
            if (response.status === 200) {
                // Update the products state to remove the deleted product
                setProducts(products.filter((product) => product._id !== id));
                // console.log('Product deleted: ', response.data);
            } else {
                console.error('Error deleting product:', response.data);
            }
        } catch (error) {
            console.error('Error during deletion: ', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    var [add, setAdd] = useState();
    add = additems.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="content d-flex">
            <div id="admin" className="admin-main">
                <div className="nav-header">
                    <div>
                        <Button variant="primary" className="nav-content1 fs-5" onClick={handleShow}>
                            Hello, <strong>Admin</strong>
                        </Button>
                        <Offcanvas show={show} onHide={handleClose} backdrop={false} scroll={true}>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Edit Product</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body style={{ backgroundColor: "#435c70" }}>
                                <Form>
                                    <Form.Group className="mb-3" controlId="productName">
                                        <Form.Label className="text-warning">Product Name</Form.Label>
                                        <Form.Control type="text" name="name" value={editProduct.name || ''} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}  placeholder="Enter product name" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="productDescription">
                                        <Form.Label className="text-warning">Product Description</Form.Label>
                                        <Form.Control as="textarea" name="description" value={editProduct.description || ''} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} placeholder="Enter product description" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="productPrice">
                                        <Form.Label className="text-warning">Product Price</Form.Label>
                                        <Form.Control type="text" name="price" value={editProduct.price || ''} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}  placeholder="Enter product price" />
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
                                                        src={`http://localhost:8080/public/data/uploads/${editProduct.image}`}
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
                    <div className="nav-content2">
                        <p className="p fs-3 fw-bold">Box Pizza</p>
                    </div>
                    <div>
                        <Button variant="secondary" className="nav-content3" onClick={Redirect}><div className="back-btn fs-5"><i className="bi bi-box-arrow-in-left text-light fw-bold"></i>&nbsp;<span className="back">Back to User</span></div></Button>
                    </div>
                </div>
                <Container fluid className="mt-3">
                    <Row>
                        <Col xs={2}>
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
                                    {/* <ListGroup.Item>
                                        <Nav.Item>
                                            <Nav.Link active={activeTab === 'update-content'} onClick={() => handleTabSelect('update-content')}>Update</Nav.Link>
                                        </Nav.Item>
                                    </ListGroup.Item> */}
                                    <ListGroup.Item>
                                        <Nav.Item>
                                            <Nav.Link active={activeTab === 'view'} onClick={() => handleTabSelect('view')}>View</Nav.Link>
                                        </Nav.Item>
                                    </ListGroup.Item>
                                </Nav>
                            </ListGroup>
                        </Col>

                        <Col xs={9} >
                            <div className="tab-content" >
                                <div className={`tab-pane fade ${activeTab === 'add' && 'show active'}`} id="add-content" role="tabpanel">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12} lg={10} xl={9} style={{ padding: '15px' }}>
                                                <div className="a1">
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title">Add Product</h2>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={12} lg={6} xl={6} >
                                                            <form action="" style={{ backgroundColor: "#435c70" }}>
                                                                <div className="form-group mb-3">
                                                                    <label htmlFor="name">Product Name</label>
                                                                    <input type="text" name="name" value={data.name} onChange={handleChange} className="form-control" />
                                                                </div>
                                                                <div className="form-group mb-3">
                                                                    <label htmlFor="description">Product Description</label>
                                                                    <textarea type="text" name="description" value={data.description} onChange={handleChange} className="form-control h-75" />
                                                                </div>
                                                                <div className="form-group mb-3">
                                                                    <label htmlFor="price">Product Price</label>
                                                                    <input type="text" name="price" value={data.price} onChange={handleChange} className="form-control" />
                                                                </div>
                                                            </form>
                                                        </Col>
                                                        <Col md={12} lg={6} xl={6}>
                                                            {/* <div className="product-img">
                                                                <i className="bi bi-cloud-arrow-up text-light fs-1 fw-bolder"></i>
                                                            </div> */}
                                                            <div className="file mt-3 mb-3">
                                                                <input
                                                                    type="file"
                                                                    name="image"
                                                                    style={{ background: '#435c70' }}
                                                                    onChange={handleFileChange}

                                                                />
                                                                {selectedImage && (
                                                                    //selectedImage is condition like if.. assume selectedImage && value
                                                                    <div className="text-center">
                                                                        <img
                                                                            alt="not found"
                                                                            width={"360px"}
                                                                            height={"300px"}
                                                                            style={{ padding: '10px', overflowX: 'hidden' }}
                                                                            src={URL.createObjectURL(selectedImage)}
                                                                        />
                                                                        <br />
                                                                        <br />
                                                                        <Button variant="danger" onClick={() => setSelectedImage(null)}>Remove</Button>&nbsp;&nbsp;
                                                                        {/* <Button variant="warning" type="file" onClick={uploadImage}
                                                                        >Upload</Button> */}
                                                                        {/* onChange={(event) => {
                                                                                console.log(event.target.files[0]);
                                                                                setSelectedImage(event.target.files[0]);
                                                                            }} */}
                                                                    </div>
                                                                )}<br />

                                                            </div>
                                                        </Col>

                                                        <Col xs={12} className="add-btn mt-5">
                                                            <Button className="border-0 btn-color" variant="danger" onClick={submitProduct}>Add Product Now</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                                {/* <div className={`tab-pane fade ${activeTab === 'update' && 'show active'}`} id="update-content" role="tabpanel">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12} lg={10} xl={9} style={{ padding: '15px' }}>
                                                <div className="a1">
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title">Edit/Delete Product</h2>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Table striped bordered hover className="align-middle text-center" style={{ border: '1px solid gray', overflowX: 'scroll' }}>
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
                                                                {Array.isArray(additems) && additems.slice(0, 100).map((a) => (
                                                                    <tbody key={a.id} className="edit-delete-table">
                                                                        <tr>
                                                                            <td className="edit-delete-table fw-bold">{count++}</td>
                                                                            <td className="d-flex justify-content-center">
                                                                                <img src={"http://localhost:8080/uploads/" + a.image} alt="#" style={{ width: '200px', height: '130px' }} />
                                                                            </td>
                                                                            <td className="edit-delete-table">{a.name}</td>
                                                                            <td className="edit-delete-table">{a.description}</td>
                                                                            <td className="edit-delete-table">{a.price}</td>
                                                                            <td>
                                                                                <div>
                                                                                onClick={() => {handleShow(); setId(a.id)}}
                                                                                    <Button variant="outline-primary" title="Edit"> 
                                                                                        <i className="bi bi-pencil-square"></i>
                                                                                    </Button>&nbsp;&nbsp;
                                                                                    <Button variant="outline-danger" onClick={() => { deleteProduct(a.id); }} title="Delete"><i className="bi bi-trash3-fill"></i></Button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))
                                                                }
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div> */}
                                <div className={`tab-pane fade ${activeTab === 'update' && 'show active'}`} id="update" role="tabpanel">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12} lg={10} xl={9} style={{ padding: '15px' }}>
                                                <div className="a1">
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title">Update Product</h2>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Table striped bordered hover className="align-middle text-center" style={{ border: '1px solid gray', overflowX: 'scroll' }}>
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
                                                                                    src={`http://localhost:8080/public/data/uploads/${product.image}`}
                                                                                    alt="#"
                                                                                    style={{ width: '200px', height: '130px' }}
                                                                                />
                                                                            </td>
                                                                            <td className="edit-delete-table">{product.name}</td>
                                                                            <td className="edit-delete-table">{product.description}</td>
                                                                            <td className="edit-delete-table">{product.price}</td>
                                                                            <td>
                                                                                <div>
                                                                                    <Button variant="outline-primary" title="Edit" onClick={() => handleEdit(product)}>
                                                                                        {/*  */}
                                                                                        {/*onClick={() => {handleShow(); setId(a.id)}} */}
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
                                            <Col xs={12} md={12} lg={10} xl={9} style={{ padding: '15px' }}>
                                                <div className="a1">
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 className="a1-title fs-4">View All Product here..</h2>
                                                        </Col>
                                                        <Col xs={3}>
                                                            <div><input
                                                                type="text"
                                                                placeholder="Search products..."
                                                                value={searchQuery}
                                                                onChange={handleSearchChange}
                                                                style={{ borderRadius: '10px' }}
                                                            />
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} className="mt-3">
                                                            <Table striped bordered hover className="align-middle text-center" style={{ border: '1px solid gray', overflowX: 'scroll' }}>
                                                                <thead className="edit-delete-table">
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th className="edit-delete-table">Product Image</th>
                                                                        <th className="edit-delete-table">Product Name</th>
                                                                        <th className="edit-delete-table">Product Description</th>
                                                                        <th className="edit-delete-table">Product Price</th>
                                                                    </tr>
                                                                </thead>
                                                                {/* Render filtered product items */}
                                                                <tbody>
                                                                    {products.map((product, index) => (
                                                                        <tr key={product._id}>
                                                                            <td className="edit-delete-table fw-bold">{index + 1}</td>
                                                                            <td className="d-flex justify-content-center">
                                                                                <img src={`http://localhost:8080/public/data/uploads/${product.image}`} alt="Product" style={{ width: '200px', height: '130px' }} />
                                                                            </td>
                                                                            <td className="edit-delete-table">{product.name}</td>
                                                                            <td className="edit-delete-table">{product.description}</td>
                                                                            <td className="edit-delete-table">{product.price}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                        {/* <Col xs={12}>
                                                            <Table striped bordered hover className="align-middle text-center" style={{ border: '1px solid gray', overflowX: 'scroll' }}>
                                                                <thead className="edit-delete-table">
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th className="edit-delete-table">Product Image</th>
                                                                        <th className="edit-delete-table">Product Name</th>
                                                                        <th className="edit-delete-table">Product Description</th>
                                                                        <th className="edit-delete-table">Product Price</th>
                                                                    </tr>
                                                                </thead>
                                                                {Array.isArray(additems) && additems.slice(0, 100).map((a) => (
                                                                    <tbody key={a.id} className="edit-delete-table">
                                                                        <tr>
                                                                            <td className="edit-delete-table fw-bold">{count++}</td>
                                                                            <td className="d-flex justify-content-center">
                                                                                <img src={"http://localhost:8080/uploads/" + a.image} alt="#" style={{ width: '200px', height: '130px' }} />
                                                                            </td>
                                                                            <td className="edit-delete-table">{a.name}</td>
                                                                            <td className="edit-delete-table">{a.description}</td>
                                                                            <td className="edit-delete-table">{a.price}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))
                                                                }
                                                            </Table>
                                                        </Col> */}
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