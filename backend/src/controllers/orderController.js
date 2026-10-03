const prisma = require('../config/db');

// Create a new order
const createOrder = async (req, res, next) => {
  try {
    const {
      total,
      userId,
      storeId,
      addressId,
      paymentMethod = 'COD',
      isCouponUsed = false,
      coupon = {},
      items, // [{ productId, quantity, price }]
    } = req.body;

    if (!userId || !storeId || !addressId || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'userId, storeId, addressId, and items are required.',
      });
    }

    const order = await prisma.order.create({
      data: {
        total: parseFloat(total),
        userId,
        storeId,
        addressId,
        paymentMethod,
        isCouponUsed: Boolean(isCouponUsed),
        coupon: coupon || {},
        status: 'ORDER_PLACED',
        isPaid: paymentMethod === 'STRIPE',
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity, 10),
            price: parseFloat(item.price),
          })),
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get orders for a specific user (Customer)
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        store: { select: { id: true, name: true, username: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get orders for a specific store (Vendor / Seller)
const getStoreOrders = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get single order details
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        store: true,
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (ORDER_PLACED, PROCESSING, SHIPPED, DELIVERED)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Update order payment status
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { isPaid: Boolean(isPaid) },
    });

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
};
