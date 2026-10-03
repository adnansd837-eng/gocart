const prisma = require('../config/db');

// Get all products with filtering, search, and sorting
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, storeId, inStock, sort, limit = 50, page = 1 } = req.query;

    const where = {};

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: { id: true, name: true, username: true, logo: true, status: true, isActive: true },
          },
          ratings: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy,
        take,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      totalCount,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / take),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        store: true,
        ratings: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new product
const createProduct = async (req, res, next) => {
  try {
    const { name, description, mrp, price, images, category, storeId, inStock } = req.body;

    if (!name || !description || mrp === undefined || price === undefined || !category || !storeId) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, mrp, price, category, and storeId are required.',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        images: Array.isArray(images) ? images : images ? [images] : [],
        category,
        storeId,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
      },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, mrp, price, images, category, inStock } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (mrp !== undefined) data.mrp = parseFloat(mrp);
    if (price !== undefined) data.price = parseFloat(price);
    if (images !== undefined) data.images = Array.isArray(images) ? images : [images];
    if (category !== undefined) data.category = category;
    if (inStock !== undefined) data.inStock = Boolean(inStock);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle product stock
const toggleProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = await prisma.product.findUnique({
      where: { id },
      select: { inStock: true },
    });

    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { inStock: !current.inStock },
    });

    res.status(200).json({
      success: true,
      message: `Product stock changed to ${updated.inStock ? 'in-stock' : 'out-of-stock'}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all distinct categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    res.status(200).json({
      success: true,
      data: categories.map((c) => c.category),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStock,
  deleteProduct,
  getCategories,
};
