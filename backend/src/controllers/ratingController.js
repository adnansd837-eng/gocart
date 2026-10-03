const prisma = require('../config/db');

// Get ratings for a product
const getProductRatings = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (error) {
    next(error);
  }
};

// Add rating / review
const addRating = async (req, res, next) => {
  try {
    const { rating, review, userId, productId, orderId } = req.body;

    if (!rating || !review || !userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'rating, review, userId, and productId are required.',
      });
    }

    const newRating = await prisma.rating.create({
      data: {
        rating: parseFloat(rating),
        review,
        userId,
        productId,
        orderId: orderId || null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newRating,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductRatings,
  addRating,
};
