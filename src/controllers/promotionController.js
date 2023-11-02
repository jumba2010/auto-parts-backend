const constants = require('../utils/constants');
const crudService = require("../services/crudService");

const createPromotion = async (req, res) => {
  try {
    const { promotionData } = req.body;
    const newPromotion = await crudService.create(constants.PROMOTION_TABLE,promotionData);

    res.status(201).json(newPromotion);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the promotion.' });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const { promotionId } = req.params;
    const { promotionData } = req.body;

    const updatedPromotion = await crudService.update(constants.PROMOTION_TABLE,promotionId, promotionData);

    if (!updatedPromotion) {
      return res.status(404).json({ message: 'Promotion not found.' });
    }

    res.json(updatedPromotion);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the promotion.' });
  }
};

const findActivePromotions = async (req, res) => {
  try {
    const activePromotions = await crudService.queryBySucursalId(constants.PROMOTION_TABLE,req.params.sucursalId);

    res.json(activePromotions);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching active promotions.' });
  }
};

module.exports = {
  createPromotion,
  updatePromotion,
  findActivePromotions,
};
