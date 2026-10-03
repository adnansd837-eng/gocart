const prisma = require('../config/db');

// Get all coupons
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new coupon
const createCoupon = async (req, res, next) => {
  try {
    const { code, description, discount, forNewUser, forMember, isPublic, expiresAt } = req.body;

    if (!code || !description || discount === undefined || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Code, description, discount, and expiresAt are required.',
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if exists
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists.',
      });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description,
        discount: parseFloat(discount),
        forNewUser: Boolean(forNewUser),
        forMember: Boolean(forMember),
        isPublic: Boolean(isPublic),
        expiresAt: new Date(expiresAt),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Validate coupon code
const validateCoupon = async (req, res, next) => {
  try {
    const { code, userId } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    // Check expiration
    if (new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    // If new user check
    if (coupon.forNewUser && userId) {
      const orderCount = await prisma.order.count({
        where: { userId },
      });
      if (orderCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is valid only for first-time buyers.',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Delete coupon
const deleteCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;

    await prisma.coupon.delete({
      where: { code: code.trim().toUpperCase() },
    });

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
};
