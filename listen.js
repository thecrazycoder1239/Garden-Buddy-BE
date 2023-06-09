const app = require("./app");
const { checkNotifcations } = require("./loops/notifications-loop");

setInterval(checkNotifcations, 10 * 60 * 1000);

app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  else console.log(`listening on ${process.env.PORT}`);
});
