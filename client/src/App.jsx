import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'

import Nav from './components/Nav'
import Alert from './components/Alert';
import ExportButton from './components/ExportButton';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';

import axios from 'axios';

function App() {

  const [user, setUser] = useState({name: '', email: '', phone: '', gender: 'Male', coupon: []})
  const totalChunks = 50;

  const [status, setStatus] = useState({ type: '', message: ''})
  const [disabled, setDisabled] = useState(false)
  const [conflictCoupons, setConflictCoupons] = useState([])

  const [progress, setProgress] = useState(0);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setConflictCoupons([])
      const text = event.target.result;
      const rows = text.split('\r\n');
      const data = rows.map((row) => row.split(','));
  
      if (data[0].length !== 1) {
        setStatus({ type: 'danger', message: 'Invalid file format' });
      } 
      else {
        const transform = data.slice(1).map((row) => row[0]);
        const hasDuplicates = new Set(transform).size !== transform.length;
        if (hasDuplicates) {
          setStatus({ type: 'danger', message: 'Duplicate records found' });
        } 
        else {
          setUser((prev) => ({ ...prev, coupon: transform }));
          setStatus({ type: '', message: '' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setStatus({ type: '', message: '' });
    processFile(file);
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
    setDisabled(true);
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
          if(index === chunks.length - 1) {
            setStatus({ type: 'info', message: 'Bulk upload successful' });
            setDisabled(false);
            setUser({name: '', email: '', phone: '', gender: 'Male', coupon: []});
          }
        }
      }
      catch(err) {
        if(err.response.status === 409) {
          console.log(`Chunk ${index + 1} has conflict coupons`);
          setConflictCoupons((prev) => [...prev, ...err.response.data.response.message]);
          setStatus({ type: 'danger', message: 'There are some duplicate records in file' });
          setProgress( Math.round(((index + 1) / chunks.length) * 100) );
          setDisabled(false);
          setUser({name: '', email: '', phone: '', gender: 'Male', coupon: []});
        }
      }
    }
  }

  const validateForm = () => {
    for (const key in user) {
      if(user[key] === '') {
        setStatus({ type: 'danger', message: 'Please fill all the fields' });
        return;
      }
    }
    if(user.coupon.length === 0) {
      setStatus({ type: 'danger', message: 'Please upload a file' });
      return;
    }
    else {
      uploadBulker();
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    validateForm();
    // if(status.message === '') {
    //   uploadBulker();
    // }
  }


  return (
    <>
      <Nav />
      <div className='container my-5'>
        <h1 className='text-center'>Bulk Upload</h1>
        <p className='text-center'>Upload a CSV file to bulk upload your data</p>
        {
          status.message && (
            <Alert type={status.type} status={status.message} />
          )
        }
        <section className='my-5'>
          <Form>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" placeholder="Enter Name" name="name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} disabled={disabled} />
                </Form.Group>
                <Form.Group as={Col} controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" name="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} disabled={disabled} />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="formBasicNumber">
                    <Form.Label>Number</Form.Label>
                    <Form.Control type="number" placeholder="Enter Phone Number" name="phone" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} disabled={disabled} />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="formBasicGender">
                    <Form.Label>Gender</Form.Label>
                        <Form.Select value={user.gender} onChange={e => setUser({  ...user, gender: e.target.value })} disabled={disabled}>
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
                <Button variant="dark" type="submit" style={{width: '100%'}} onClick={submitHandler} disabled={disabled}> Submit </Button>
            </div>
          </Form>
        </section>
        {
          conflictCoupons.length > 0 && (
            <section className='my-5'>
              <h3 className='text-center my-4'>Conflict Coupons</h3>
              <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Coupon</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    conflictCoupons
                    .filter((c) => c.coupon !== '')
                    .map((c, index) => (
                      <tr key={index}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.gender}</td>
                        <td>{c.coupon}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <div className='text-end my-4'>
                <ExportButton data={conflictCoupons} />
              </div>
            </section>
          )
        }
      </div>
    </>
  )
}

export default App
