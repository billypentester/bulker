import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'

import Nav from './components/Nav'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Alert from 'react-bootstrap/Alert';

import axios from 'axios';

function App() {

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    coupon: []
  })

  const [error, setError] = useState(false)
  const [conflictCoupons, setConflictCoupons] = useState([])

  const totalChunks = 50;

  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\r\n');
        const data = rows.map(row => row.split(','));
        const transform = data.slice(1).map(row => row[0]);
        if(transform.length !== new Set(transform).size) {
          setError(true);
        }
        else
        {
          setUser((prev) => ({ ...prev, coupon: transform }));  
        }
      };
      reader.readAsText(file);
    }
  };

  function chunkArray(arr, chunkSize) {
    const chunks = [];
    const length = arr.length;
    let i = 0;
  
    while (i < length) {
      chunks.push(arr.slice(i, i + chunkSize));
      i += chunkSize;
    }
  
    return chunks;
  }


  const uploadBulker = async (e) => {

    e.preventDefault();
    const chunkSize = Math.ceil(user.coupon.length / totalChunks);
    const chunks = chunkArray(user.coupon, chunkSize);
    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      try{
        const res = await axios.post('http://localhost:5000/user/', {
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          coupon: chunk
        });        
        if(res.status === 201) {
          console.log(`Chunk ${index + 1} uploaded successfully`);
          setProgress( Math.round(((index + 1) / chunks.length) * 100) );
        }
      }
      catch(err) {
        if(err.response.status === 409) {
          console.log(`Chunk ${index + 1} has conflict coupons`);
          console.log(err.response.data.response.message);
          setConflictCoupons((prev) => [...prev, ...err.response.data.response.message]);
        }
      }
    }

  }

  return (
    <>
      <Nav />
      <div className='container my-5'>
        <h1 className='text-center'>Bulk Upload</h1>
        <p className='text-center'>Upload a CSV file to bulk upload your data</p>
        {
          error && (
            <Alert variant='danger'> Duplicate coupons are present in uploaded file </Alert>
          )
        }
        <section className='my-5'>
          <Form>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" placeholder="Enter Name" name="name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" name="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="formBasicNumber">
                    <Form.Label>Number</Form.Label>
                    <Form.Control type="number" placeholder="Enter Phone Number" name="phone" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="formBasicGender">
                    <Form.Label>Gender</Form.Label>
                        <Form.Select value={user.gender} onChange={e => setUser({  ...user, gender: e.target.value })}>
                        <option>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} lassName="mb-3" controlId="formFile">
                    <Form.Label>File</Form.Label>
                    <Form.Control type="file" accept='.csv' onChange={handleFileChange} />
                </Form.Group>
            </Row>
            {
              progress > 0 && progress < 100 && (
                <div className="my-3">
                  <ProgressBar now={progress} label={`${progress}%`} variant='danger' min={0} max={100} />
                </div>
              )
            }
            <div className="my-3">
                <Button variant="dark" type="submit" style={{width: '100%'}} onClick={uploadBulker}> Submit </Button>
            </div>
          </Form>
        </section>
        {
          conflictCoupons.length > 0 && (
            <section className='my-5'>
              <h3 className='text-center'>Conflict Coupons</h3>
              <ul>
                {
                  conflictCoupons.map((coupon, index) => (
                    <li key={index}>{coupon.coupon}</li>
                  ))
                }
              </ul>
            </section>
          )
        }
      </div>
    </>
  )
}

export default App
