import Alert from 'react-bootstrap/Alert';

const AlertComponent = ({ type, status }) => {
  return (
    <Alert variant={type}> {status} </Alert>
  )
}

export default AlertComponent
