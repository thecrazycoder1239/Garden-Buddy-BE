const db = require('../db/')

exports.insertSubscription = ({ username, pushSubscription }) => {
  return db.query(`
  INSERT INTO subscriptions
    (username, push_subscription, push_endpoint)
  VALUES
    ($1, $2, $3)
  `, [username, pushSubscription, pushSubscription.endpoint] )
  
}

exports.deleteSubscription = ({ pushSubscription }) => {
  return db.query(`
  DELETE FROM subscriptions
  WHERE push_endpoint = $1
  `, [pushSubscription.endpoint])
}