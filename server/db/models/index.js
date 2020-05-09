const User = require('./user')
const Product = require('./product')
const OrderItems = require('./order-items')
const Order = require('./order')

User.hasMany(Order)
Order.belongsTo(User)

Product.belongsToMany(Order, {through: OrderItems})
Order.belongsToMany(Product, {through: OrderItems})

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

module.exports = {
  User,
  Product,
  OrderItems,
  Order
}
