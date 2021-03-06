import React from 'react'
import {connect} from 'react-redux'
import {getDetails} from '../store/product'
import {createOrderItem, updateOrderItem} from '../store/orderItems'
import {updateOrder} from '../store/orders'
import {getReviews} from '../store/reviews'

class ProductDetails extends React.Component {
  constructor() {
    super()
    this.addToCart = this.addToCart.bind(this)
  }

  componentDidMount() {
    const productId = this.props.match.params.id
    this.props.getProduct(productId)
    this.props.loadReviews()
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
    const {
      product,
      cart,
      orderItems,
      reviews,
      users,
      totalReviews,
      averageRating
    } = this.props
    if (!orderItems || !cart || !reviews || !users) {
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
            <h3>Description:</h3>
            <p className="description-overflow">{product.description}</p>
            <h4>Platform: {product.category}</h4>

            <h4>Price ${product.price}</h4>
            {/* <p>Quantity: {product.inventory}</p> */}
            <button onClick={addToCart}>Add to Cart</button>
          </div>

          <div className="details-3">
            <h3> Reviews </h3>
            <h4>Total Reviews: {totalReviews}</h4>
            <h4>
              {' '}
              Average Rating:{' '}
              {isNaN(averageRating) ? 'No Reviews' : `${averageRating}/10`}
            </h4>
            <div className="review-overflow">
              {reviews
                .filter(review => review.productId === product.id)
                .map(review => (
                  <li className="review" key={review.id}>
                    <p>
                      ------------------------------------------------------
                    </p>
                    <p>Rating: {review.stars} / 10</p>
                    <q> {review.text} </q>
                    <p>
                      -
                      {
                        users.find(_user => _user.id === review.userId)
                          .firstName
                      }
                    </p>
                    <p>
                      --------------------------------------------------------
                    </p>
                  </li>
                ))}
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = ({
  products,
  product,
  orders,
  user,
  orderItems,
  reviews,
  users
}) => {
  const cart = user.id
    ? orders.find(order => order.status === 'cart' && order.userId === user.id)
    : orders.find(
        order =>
          order.status === 'cart' &&
          order.userId === localStorage.getItem('guestId')
      )

  const totalReviews = reviews.filter(review => review.productId === product.id)
    .length

  const totalRating = reviews
    .filter(review => review.productId === product.id)
    .reduce((accum, review) => {
      return (accum += review.stars)
    }, 0)

  const averageRating = (totalRating / totalReviews).toFixed(1)

  return {
    products,
    product,
    cart,
    orders,
    user,
    orderItems,
    reviews,
    users,
    totalReviews,
    averageRating
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProduct: id => dispatch(getDetails(id)),
    newOrderItem: orderItem => dispatch(createOrderItem(orderItem)),
    incrementOrderItem: orderItem => dispatch(updateOrderItem(orderItem)),
    updateTotalPrice: (order, push) => dispatch(updateOrder(order, push)),
    loadReviews: () => dispatch(getReviews())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
