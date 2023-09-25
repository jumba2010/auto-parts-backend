const cognitoService = require('../services/aws/cognitoService');

const createUser = async (req, res) => {
  try {
    const { userData } = req.body;

    const newUser = await userService.createUser(userData);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userData } = req.body;

    const updatedUser = await userService.updateUser(userId, userData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
};

const inactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await userService.inactivateUser(userId);

    res.json({ message: 'User inactivated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while inactivating the user.' });
  }
};

const findActiveUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userService.findActiveUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Active user not found.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the active user.' });
  }
};

module.exports = {
  createUser,
  updateUser,
  inactivateUser,
  findActiveUserById,
};
