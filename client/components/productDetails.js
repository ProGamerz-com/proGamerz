import React from 'react'
import {connect} from 'react-redux'
import {getDetails} from '../store/product'
import {createOrderItem, updateOrderItem} from '../store/orderItems'
import {updateOrder} from '../store/orders'

class ProductDetails extends React.Component {
  constructor() {
    super()
    this.addToCart = this.addToCart.bind(this)
  }

  componentDidMount() {
    const productId = this.props.match.params.id
    this.props.getProduct(productId)
  }

  async addToCart(event) {
    event.preventDefault()
    try {
      const existingOrderItem = this.props.orderItems.find(
        orderItem =>
          orderItem.productId === this.props.product.id &&
          orderItem.orderId === this.props.cart.id
      )
      if (!existingOrderItem) {
        await this.props.newOrderItem({
          productId: this.props.product.id,
          orderId: this.props.cart.id
        })
      } else {
        await this.props.incrementOrderItem({
          productId: this.props.product.id,
          orderId: this.props.cart.id,
          quantity: existingOrderItem.quantity + 1
        })
      }
      await this.props.updateTotalPrice(
        {
          id: this.props.cart.id,
          totalPrice:
            parseFloat(this.props.cart.totalPrice) +
            parseFloat(this.props.product.price)
        },
        () => {}
      )
    } catch (exception) {
      console.log(exception)
    }
  }

  render() {
    const {addToCart} = this
    const {product, cart, orderItems} = this.props
    if (!orderItems || !cart) {
      return <h1>Loading...</h1>
    } else {
      const existingOrderItem = orderItems.find(
        orderItem =>
          orderItem.productId === product.id && orderItem.orderId === cart.id
      )
      return (
        <div className="product-details">
          <div className="details-1">
            <h3>{product.title}</h3>
            <img className="img-details" src={product.imageURL} />
          </div>

          <div className="details-2">
            <p>Description: {product.description}</p>
            <p>Platform: {product.category}</p>
            <p>Reviews</p>
          </div>

          <div className="details-3">
            <p>${product.price}</p>
            <p>Quantity: {product.inventory}</p>
            <button onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = ({products, product, orders, user, orderItems}) => {
  const cart = user.id
    ? orders.find(order => order.status === 'cart' && order.userId === user.id)
    : orders.find(
        order =>
          order.status === 'cart' &&
          order.userId === parseInt(localStorage.getItem('guestId'))
      )

  return {
    products,
    product,
    cart,
    orders,
    user,
    orderItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProduct: id => dispatch(getDetails(id)),
    newOrderItem: orderItem => dispatch(createOrderItem(orderItem)),
    incrementOrderItem: orderItem => dispatch(updateOrderItem(orderItem)),
    updateTotalPrice: (order, push) => dispatch(updateOrder(order, push))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
