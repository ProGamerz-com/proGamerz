import React from 'react'
import {connect} from 'react-redux'
import {getProducts} from '../store'
import ProductCard from './ProductCard.js'
import {createOrderItem} from '../store/orderItems'
import {getOrders} from '../store/orders'

class Products extends React.Component {
  constructor() {
    super()
    this.state = {
      category: 'all'
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(ev) {
    this.setState({
      category: ev.target.value
    })
  }

  render() {
    const {products} = this.props
    const {category} = this.state
    let filteredProducts
    if (category !== 'all') {
      filteredProducts = products.filter(
        product => product.category === category
      )
    } else {
      filteredProducts = products
    }

    if (!filteredProducts.length) {
      return (
        <div className="search-bar">
          <p>Search by Platform</p>
          <select onChange={this.onChange} value={category}>
            <option value="all">All</option>
            <option value="Xbox">Xbox</option>
            <option value="Playstation">Playstation</option>
            <option value="PC">PC</option>
            <option value="Nintendo">Nintendo</option>
          </select>
          <h1>There are no games currently available</h1>
        </div>
      )
    } else {
      return (
        <div>
          <div className="search-bar">
            <p>Search by Platform</p>
            <select onChange={this.onChange} value={category}>
              <option value="all">All</option>
              <option value="Xbox">Xbox</option>
              <option value="Playstation">Playstation</option>
              <option value="PC">PC</option>
              <option value="Nintendo">Nintendo</option>
            </select>
          </div>

          <div className="product-overflow">
            <ul className="wrapper">
              {filteredProducts.map(product => {
                return <ProductCard key={product.id} {...product} />
              })}
            </ul>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = ({products, user}) => {
  return {products, user}
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(getProducts()),
    loadOrders: () => dispatch(getOrders()),
    addToCart: orderItem => dispatch(createOrderItem(orderItem))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)
