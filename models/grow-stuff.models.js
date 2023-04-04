const request = require("axios");
const db = require("../db");

const getFromGrowstuffCacheFirst = (plant_id) => {
  return db
    .query(
      `
  SELECT * FROM growstuff_cache
  WHERE plant_id = $1
  `,
      [plant_id]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return {rows};
      }

      return request({
        method: "GET",
        url: `https://www.growstuff.org/crops/${plant_id}.json`,
      })
        .then(({data: crop}) => {
          return request({
            method: "GET",
            url: `https://www.growstuff.org/crops/search.json`,
            params: {
              term: crop.slug,
            },
          });
        })
        .then(({data: crops}) => {
          //assume that the first search result matches slug
          return db.query(
            `
      INSERT INTO growstuff_cache
        (plant_id, name, thumbnail_url)
      VALUES
        ($1, $2, $3)
      RETURNING *;
      `,
            [plant_id, crops[0].name, crops[0].thumbnail_url]
          );
        });
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.combineUsersPlantWithGrowstuffData = (usersPlant) => {
  return getFromGrowstuffCacheFirst(usersPlant.plant_id)
    .then(growstuffData => {
      return {
        ...usersPlant,
        ...growstuffData
      }
    })
}
