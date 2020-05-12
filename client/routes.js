import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  Products,
  Cart,
  ProductDetails,
  CreateProduct,
  Orders,
  Account,
  Listings,
  UserList,
  Checkout
} from './components'
import {me, getProducts, getUsers} from './store'
import EditProduct from './components/EditProduct'
import {getOrderItems} from './store/orderItems'
import {getOrders} from './store/orders'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props
    const {user} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={UserHome} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route exact path="/products/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route path="/cart" component={Cart} />
        <Route path="/orders" component={Orders} />
        <Route path="/checkout" component={Checkout} />
        {isLoggedIn && (
          <Switch>
            <Route exact path="/account" component={Account} />
            <Route exact path="/listings" component={Listings} />
            <Route exact path="/userlist" component={UserList} />
            <Route exact path="/products/:id/edit" component={EditProduct} />
            <Route exact path="/newProduct" component={CreateProduct} />
            {/* Routes placed here are only available after logging in */}
          </Switch>
        )}
        {user.admin == true && <Switch />}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
      dispatch(getUsers())
      dispatch(getProducts())
      dispatch(getOrders())
      dispatch(getOrderItems())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
