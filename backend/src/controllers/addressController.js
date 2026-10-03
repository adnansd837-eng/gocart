const prisma = require('../config/db');

// Get all addresses for a user
const getUserAddresses = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new address
const createAddress = async (req, res, next) => {
  try {
    const { userId, name, email, street, city, state, zip, country, phone } = req.body;

    if (!userId || !name || !email || !street || !city || !state || !zip || !country || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All address fields (userId, name, email, street, city, state, zip, country, phone) are required.',
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing address
const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, street, city, state, zip, country, phone } = req.body;

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    next(error);
  }
};

// Delete address
const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
