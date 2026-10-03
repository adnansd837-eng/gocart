const prisma = require('../config/db');

// Register or Sync User
const registerUser = async (req, res, next) => {
  try {
    const { id, name, email, image, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    // Upsert user (create if new, update if exists)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        image: image || undefined,
      },
      create: {
        id: id || undefined,
        name,
        email,
        image: image || '',
        role: role || 'user',
        cart: {},
      },
      include: {
        store: true,
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get User Profile with Store & Addresses
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        store: true,
        addresses: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update User Cart
const updateUserCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cart } = req.body;

    if (!cart || typeof cart !== 'object') {
      return res.status(400).json({ success: false, message: 'Valid cart object is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { cart },
    });

    res.status(200).json({
      success: true,
      data: updatedUser.cart,
    });
  } catch (error) {
    next(error);
  }
};

// List Users (Admin)
const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        store: true,
        _count: {
          select: { buyerOrders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  updateUserCart,
  listUsers,
};
