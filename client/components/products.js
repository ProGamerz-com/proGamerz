import React from 'react'
import {connect} from 'react-redux'
import ProductCard from './productCard.js'

const Products = ({products}) => {
  return (
    <div>
      <ul className="wrapper">
        {products.map(product => {
          return <ProductCard key={product.id} {...product} />
        })}
      </ul>
    </div>
  )
}

const mapStateToProps = ({products}) => {
  return {products}
}

export default connect(mapStateToProps)(Products)
