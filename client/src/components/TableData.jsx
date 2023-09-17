import Table from 'react-bootstrap/Table';

const TableData = ({ name, email, phone, gender, coupon }) => {
  return (
    <Table striped bordered hover>
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
            <tr>
                
            </tr>
        </tbody>
    </Table>
  )
}

export default TableData
