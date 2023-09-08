const promotionService = require('../services/promotionService');

const createPromotion = async (req, res) => {
  try {
    const { promotionData } = req.body;
    const newPromotion = await promotionService.createPromotion(promotionData);

    res.status(201).json(newPromotion);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the promotion.' });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const { promotionId } = req.params;
    const { promotionData } = req.body;

    const updatedPromotion = await promotionService.updatePromotion(promotionId, promotionData);

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
    const activePromotions = await promotionService.findActivePromotions();

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
