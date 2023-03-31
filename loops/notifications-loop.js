const db = require("../db")
const webpush = require("web-push")

const vapidDetails = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
  subject: process.env.VAPID_SUBJECT
}

const options = {
  TTL: 1000,
  vapidDetails
}

exports.checkNotifcations = () => {
  db.query(`
  UPDATE users_plants_tasks
  SET notified = true
  FROM users_plants
    INNER JOIN users
      ON users.username = users_plants.username
    INNER JOIN subscriptions
      ON users.username = subscriptions.username, tasks

  WHERE users_plants_tasks.task_start_date < CURRENT_TIMESTAMP
    AND users_plants_tasks.notified = false
    AND users_plants_tasks.users_plant_id = users_plants.users_plant_id
    AND users_plants_tasks.task_slug = tasks.task_slug
  RETURNING push_subscription, tasks.task_slug, description
  `)
  .then(({ rows }) => {

    rows.forEach(row => {
      const notification = JSON.stringify({
        title: `${row.task_slug} reminder for one of your plants`,
        options: {
          body: row.description
        }
      })

      try {
        console.log("notified")
        webpush(row.push_subscription, notification, options)
      } catch {
        db.query(`
        DELETE FROM subscriptions
        WHERE push_endpoint = $1
        `, [row.push_endpoint])
      }
    })
  })
  .catch(console.error)
}