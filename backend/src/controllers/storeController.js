const prisma = require('../config/db');

// Get all stores (optional filter by status)
const getAllStores = async (req, res, next) => {
  try {
    const { status, isActive } = req.query;

    const where = {};
    if (status) where.status = status;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const stores = await prisma.store.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { products: true, orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    next(error);
  }
};

// Get store by ID
const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        products: true,
      },
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Get store by username
const getStoreByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const store = await prisma.store.findUnique({
      where: { username },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        products: {
          where: { inStock: true },
          include: {
            ratings: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Get store by User ID
const getStoreByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const store = await prisma.store.findUnique({
      where: { userId },
      include: {
        products: true,
      },
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'No store registered for this user' });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new store application
const createStore = async (req, res, next) => {
  try {
    const { userId, name, username, description, email, contact, address, logo } = req.body;

    if (!userId || !name || !username || !email || !contact || !address) {
      return res.status(400).json({
        success: false,
        message: 'userId, name, username, email, contact, and address are required.',
      });
    }

    // Check if user already has a store
    const existingUserStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (existingUserStore) {
      return res.status(400).json({
        success: false,
        message: 'User already has a registered store.',
        store: existingUserStore,
      });
    }

    // Check username availability
    const existingUsername = await prisma.store.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken. Please choose another one.',
      });
    }

    const store = await prisma.store.create({
      data: {
        userId,
        name,
        username,
        description: description || '',
        email,
        contact,
        address,
        logo: logo || '',
        status: 'pending',
        isActive: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Store submitted successfully and is pending admin approval.',
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Admin approve or reject store
const updateStoreStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be approved, rejected, or pending.',
      });
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        status,
        isActive: status === 'approved',
      },
    });

    res.status(200).json({
      success: true,
      message: `Store ${status} successfully.`,
      data: updatedStore,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle store isActive
const toggleStoreActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = await prisma.store.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!current) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: { isActive: !current.isActive },
    });

    res.status(200).json({
      success: true,
      message: `Store active status changed to ${updatedStore.isActive}`,
      data: updatedStore,
    });
  } catch (error) {
    next(error);
  }
};

// Get Store Dashboard Metrics
const getStoreDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [totalProducts, orders, ratings] = await Promise.all([
      prisma.product.count({ where: { storeId: id } }),
      prisma.order.findMany({
        where: { storeId: id },
        select: { total: true },
      }),
      prisma.rating.findMany({
        where: { product: { storeId: id } },
        include: {
          user: { select: { id: true, name: true, image: true } },
          product: { select: { id: true, name: true, category: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalOrders = orders.length;
    const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        ratings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  getStoreByUsername,
  getStoreByUserId,
  createStore,
  updateStoreStatus,
  toggleStoreActive,
  getStoreDashboard,
};
