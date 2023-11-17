const constants = require('../utils/constants');
const crudService = require("../services/crudService");


const findBySucursalId = async (req, res) => {
  try {
    
    const { sucursalId} = req.params;
    const {lastEvaluatedKey, pageLimit } = req.query;

    const wishList = await crudService.findBySucursalId(constants.WISH_LIST_TABLE,sucursalId);

    res.status(200).json(wishList);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};


module.exports = {
  findBySucursalId,
};
