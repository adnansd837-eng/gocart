const prisma = require('../config/db');

// Get Admin Dashboard Overview
const getAdminDashboard = async (req, res, next) => {
  try {
    const [ordersCount, storesCount, productsCount, orders] = await Promise.all([
      prisma.order.count(),
      prisma.store.count({ where: { status: 'approved' } }),
      prisma.product.count(),
      prisma.order.findMany({
        select: {
          id: true,
          total: true,
          createdAt: true,
          status: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const allOrders = orders.map((o) => ({
      createdAt: o.createdAt,
      total: o.total,
    }));

    res.status(200).json({
      success: true,
      data: {
        orders: ordersCount,
        stores: storesCount,
        products: productsCount,
        revenue: totalRevenue.toFixed(2),
        allOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Pending Stores for Approval
const getPendingStores = async (req, res, next) => {
  try {
    const pendingStores = await prisma.store.findMany({
      where: { status: 'pending' },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: pendingStores.length,
      data: pendingStores,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getPendingStores,
};
