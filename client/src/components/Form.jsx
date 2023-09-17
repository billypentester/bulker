import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function FormComponent() {
  return (
    <Form>
        <Row className="mb-3">
            <Form.Group as={Col} controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="name" placeholder="Enter Name" />
            </Form.Group>
            <Form.Group as={Col} controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email" />
            </Form.Group>
        </Row>
        <Row className="mb-3">
            <Form.Group as={Col} className="mb-3" controlId="formBasicNumber">
                <Form.Label>Number</Form.Label>
                <Form.Control type="number" placeholder="Enter Phone Number" />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="formBasicGender">
                <Form.Label>Gender</Form.Label>
                    <Form.Select>
                    <option>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </Form.Select>
            </Form.Group>
            <Form.Group as={Col} lassName="mb-3" controlId="formFile">
                <Form.Label>File</Form.Label>
                <Form.Control type="file" />
            </Form.Group>
        </Row>
        <div className="my-3">
            <Button variant="dark" type="submit" style={{width: '100%'}}> Submit </Button>
        </div>
    </Form>
  );
}

export default FormComponent;