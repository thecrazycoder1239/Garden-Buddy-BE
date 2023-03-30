const { getGrowStuffJSON } = require("../controllers/grow-stuff.controllers");

const growStuffRouter = require("express").Router();

//This was tested using insomnia, due to the potentially dynamic nature of growstuff database

growStuffRouter.get("/:category", getGrowStuffJSON);

growStuffRouter.get("/:category/:id_or_search", getGrowStuffJSON);

module.exports = growStuffRouter;
