const constants = require('../utils/constants');
const crudService = require("../services/crudService");


const findBySucursalId = async (req, res) => {
  try {
    
    const { sucursalId} = req.params;
    const {lastEvaluatedKey, pageLimit } = req.query;

    const popularCategories = await crudService.queryBySucursalId(constants.POPULAR_CATEGORY_TABLE,sucursalId, lastEvaluatedKey, pageLimit);

    res.status(200).json(popularCategories);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};


module.exports = {
  findBySucursalId,
};
