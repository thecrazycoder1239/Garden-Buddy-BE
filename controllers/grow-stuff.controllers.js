const request = require("axios");

exports.getGrowStuffJSON = (req, res, next) => {
  const { category, id_or_search } = req.params;
  const { page = 1, term } = req.query;

  const path = `/${category}${id_or_search !== undefined ? '/' + id_or_search : ''}`

  request({
    method: "GET",
    url: `https://www.growstuff.org${path}.json`,
    //growstuff serves pages of 100
    params: {
      page: Math.floor(page / 10) + 1,
      term
    }
  })
    .then(({ data }) => {
      if (Array.isArray(data)) {
        //Serve only 10 plants at a time
        res.status(200).send(data.slice(10 * ((page - 1) % 10), 10 * (page % 10) || undefined))
      } else {
        res.status(200).send(data)
      }

    })
    .catch(next)
}
