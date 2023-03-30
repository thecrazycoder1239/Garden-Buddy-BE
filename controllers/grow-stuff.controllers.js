const request = require("axios");

exports.getGrowStuffJSON = (req, res, next) => {
  const { category, id } = req.params;

  const path = `/${category}${id !== undefined ? '/' + id : ''}`

  request({
    method: "GET",
    url: `https://www.growstuff.org${path}.json`
  })
    .then(({ data }) => {
      res.status(200).send(data)
    })
    .catch(next)
}
