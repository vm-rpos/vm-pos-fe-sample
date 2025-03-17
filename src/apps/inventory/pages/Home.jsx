import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <a href="/inventory/category">Menu Management</a> &nbsp;
      <a href="/inventory/vendors">Vendors</a> &nbsp;
      <a href='/inventory/orders'>Orders</a>&nbsp;
      <br/>
      <Link to='/inventory/orders/purchaseOrder'>Purchase Orders</Link> &nbsp;
      <br/>
      <Link to='/inventory/orders/saleOrder'>Sale Orders</Link> &nbsp;
      <br/>
      <Link to='/inventory/orders/stockoutOrder'>Stock Out Orders</Link>
    </div>
  )
}

export default Home
