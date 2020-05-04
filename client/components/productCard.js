import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const ProductCard = ({
  id,
  title,
  imageURL,
  price,
  inventory,
  products,
  cart
}) => {
  return (
    <li key={id} className="card">
      <h4>{title}</h4>
      <br />
      <img src={imageURL} />
      <p>${price}</p>
      <Link to={`/products/${id}`} className="productLink">
        More Details
      </Link>
      <button onClick={ev => cart.items.push(`${id}`)}> Add to Cart </button>
      <p>Quantity: {inventory}</p>
    </li>
  )
}

const mapStateToProps = ({products, cart}) => {
  return {
    products,
    cart
  }
}

export default connect(mapStateToProps)(ProductCard)
