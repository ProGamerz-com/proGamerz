import React from 'react'
import {connect} from 'react-redux'
import {
  deleteOrderItem,
  updateOrderItem,
  getOrderItem,
  orderItems
} from '../store/orderItems'

class ProductList extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {orderId, productId, quantity, products, orderItem} = this.props
    const product = products.find(product => product.id === productId)
    if (!product) {
      return <h1>Loading...</h1>
    } else {
      return (
        <li className="cart-items">
          <img src={product.imageURL} />
          <p>{product.title}</p>
          <p>${product.price * quantity}</p>
          <p>Quantity: {quantity}</p>
          <div>
            <button
              onClick={() => {
                this.props.addOrSubtract({
                  orderId,
                  productId,
                  quantity: quantity - 1
                })
              }}
            >
              -
            </button>
            <button
              onClick={() => {
                this.props.addOrSubtract({
                  orderId,
                  productId,
                  quantity: quantity + 1
                })
              }}
            >
              +
            </button>
          </div>
          <button
            onClick={() => this.props.removeFromCart({orderId, productId})}
          >
            Remove From Cart
          </button>
        </li>
      )
    }
  }
}

const mapStateToProps = ({products, orderItems, orderItem}) => {
  return {
    products,
    orderItems,
    orderItem
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadOrderItem: orderItem => dispatch(getOrderItem(orderItem)),
    addOrSubtract: orderItem => dispatch(updateOrderItem(orderItem)),
    removeFromCart: orderItem => dispatch(deleteOrderItem(orderItem))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
