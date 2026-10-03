const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GoCart database seeding...');

  // 1. Clear existing data in reverse order of foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Create Users
  const user1 = await prisma.user.create({
    data: {
      id: 'user_31dQbH27HVtovbs13X2cmqefddM',
      name: 'GreatStack',
      email: 'greatstack@example.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin',
      cart: {},
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'user_31dOriXqC4TATvc0brIhlYbwwc5',
      name: 'John Seller',
      email: 'seller@example.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'seller',
      cart: {},
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: 'user_customer_demo',
      name: 'Kristin Watson',
      email: 'kristin@example.com',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'user',
      cart: {},
    },
  });

  console.log('✅ Created 3 sample users.');

  // 3. Create Stores
  const store1 = await prisma.store.create({
    data: {
      id: 'cmemkb98v0001tat8r1hiyxhn',
      userId: user1.id,
      name: 'GreatStack Tech Store',
      description: 'The education marketplace where you can buy goodies related to coding and tech gadgets.',
      username: 'greatstack',
      address: '123 Maplewood Drive Springfield, IL 62704 USA',
      status: 'approved',
      isActive: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      email: 'greatstack@example.com',
      contact: '+1 234 567 8900',
    },
  });

  const store2 = await prisma.store.create({
    data: {
      id: 'cmemkqnzm000htat8u7n8cpte',
      userId: user2.id,
      name: 'Happy Shop',
      description: 'At Happy Shop, we believe shopping should be simple, smart, and satisfying. High quality electronics and lifestyle products.',
      username: 'happyshop',
      address: '3rd Floor, Happy Shop, New Building, 123 street, NY, US',
      status: 'approved',
      isActive: true,
      logo: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=150',
      email: 'happyshop@example.com',
      contact: '+1 987 654 3210',
    },
  });

  const pendingStore = await prisma.store.create({
    data: {
      id: 'cmem_pending_store_demo',
      userId: user3.id,
      name: 'Nordic Minimalist Living',
      description: 'Handcrafted Scandinavian furniture and modern lifestyle items.',
      username: 'nordicliving',
      address: '456 Nordic Avenue, Oslo, Norway',
      status: 'pending',
      isActive: false,
      logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150',
      email: 'nordic@example.com',
      contact: '+47 12345678',
    },
  });

  console.log('✅ Created 3 sample stores (2 approved, 1 pending).');

  // 4. Create Products
  const productsData = [
    {
      id: 'prod_1',
      name: 'Modern Table Lamp',
      description: 'Modern table lamp with a sleek minimalist design. Perfect for study rooms and workspaces with warm ambient light.',
      mrp: 40.0,
      price: 29.0,
      category: 'Decoration',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600',
      ],
      storeId: store2.id,
      inStock: true,
    },
    {
      id: 'prod_2',
      name: 'Smart Speaker Gray',
      description: 'Smart speaker with high-fidelity 360-degree audio, voice assistance, and seamless multi-room wireless synchronization.',
      mrp: 50.0,
      price: 39.0,
      category: 'Speakers',
      images: ['https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600'],
      storeId: store2.id,
      inStock: true,
    },
    {
      id: 'prod_3',
      name: 'Smart Watch White',
      description: 'Smart watch with AMOLED display, continuous heart rate monitoring, sleep analysis, and 10-day battery life.',
      mrp: 79.0,
      price: 49.0,
      category: 'Watch',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      storeId: store1.id,
      inStock: true,
    },
    {
      id: 'prod_4',
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Active Noise Canceling over-ear wireless headphones with crystal-clear 40mm drivers and 40-hour playback.',
      mrp: 99.0,
      price: 69.0,
      category: 'Headphones',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      storeId: store1.id,
      inStock: true,
    },
    {
      id: 'prod_5',
      name: 'RGB Gaming Mouse',
      description: 'Ergonomic high-precision optical gaming mouse with customizable RGB lighting and 16,000 DPI sensor.',
      mrp: 49.0,
      price: 29.0,
      category: 'Mouse',
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600'],
      storeId: store2.id,
      inStock: true,
    },
    {
      id: 'prod_6',
      name: 'Smart Pen for Touchscreens',
      description: 'Ultra-low latency pressure-sensitive stylus compatible with iPads, Android tablets, and touchscreen laptops.',
      mrp: 89.0,
      price: 59.0,
      category: 'Pen',
      images: ['https://images.unsplash.com/photo-1585336261026-c7f76387d896?w=600'],
      storeId: store1.id,
      inStock: true,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  console.log(`✅ Created ${productsData.length} products.`);

  // 5. Create Addresses
  const address1 = await prisma.address.create({
    data: {
      id: 'cmemm6g95001ftat8omv9b883',
      userId: user1.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      street: '123 Main St, Suite 400',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone: '+1 212 555 0199',
    },
  });

  const address2 = await prisma.address.create({
    data: {
      id: 'addr_demo_2',
      userId: user3.id,
      name: 'Kristin Watson',
      email: 'kristin@example.com',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'USA',
      phone: '+1 312 555 0144',
    },
  });

  console.log('✅ Created 2 sample customer addresses.');

  // 6. Create Coupons
  const couponsData = [
    {
      code: 'NEW20',
      description: '20% Off for New Users',
      discount: 20.0,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: new Date('2027-12-31'),
    },
    {
      code: 'NEW10',
      description: '10% Off for New Users',
      discount: 10.0,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: new Date('2027-12-31'),
    },
    {
      code: 'OFF20',
      description: '20% Off for All Orders',
      discount: 20.0,
      forNewUser: false,
      forMember: false,
      isPublic: true,
      expiresAt: new Date('2027-12-31'),
    },
    {
      code: 'OFF10',
      description: '10% Off for All Orders',
      discount: 10.0,
      forNewUser: false,
      forMember: false,
      isPublic: true,
      expiresAt: new Date('2027-12-31'),
    },
    {
      code: 'PLUS10',
      description: '10% Extra Discount for Members',
      discount: 10.0,
      forNewUser: false,
      forMember: true,
      isPublic: true,
      expiresAt: new Date('2028-01-01'),
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }

  console.log(`✅ Created ${couponsData.length} coupons.`);

  // 7. Create Orders & OrderItems
  const order1 = await prisma.order.create({
    data: {
      id: 'cmemm75h5001jtat89016h1p3',
      total: 68.0,
      status: 'DELIVERED',
      userId: user1.id,
      storeId: store2.id,
      addressId: address1.id,
      isPaid: true,
      paymentMethod: 'COD',
      isCouponUsed: true,
      coupon: { code: 'OFF20', discount: 20 },
      orderItems: {
        create: [
          { productId: 'prod_1', quantity: 1, price: 29.0 },
          { productId: 'prod_2', quantity: 1, price: 39.0 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: 'cmemm6jv7001htat8vmm3gxaf',
      total: 128.0,
      status: 'SHIPPED',
      userId: user1.id,
      storeId: store1.id,
      addressId: address1.id,
      isPaid: true,
      paymentMethod: 'STRIPE',
      isCouponUsed: false,
      orderItems: {
        create: [
          { productId: 'prod_3', quantity: 1, price: 49.0 },
          { productId: 'prod_4', quantity: 1, price: 69.0 },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      id: 'order_demo_3',
      total: 29.0,
      status: 'PROCESSING',
      userId: user3.id,
      storeId: store2.id,
      addressId: address2.id,
      isPaid: false,
      paymentMethod: 'COD',
      isCouponUsed: false,
      orderItems: {
        create: [
          { productId: 'prod_5', quantity: 1, price: 29.0 },
        ],
      },
    },
  });

  console.log('✅ Created 3 sample orders with items.');

  // 8. Create Ratings & Reviews
  await prisma.rating.createMany({
    data: [
      {
        rating: 4.8,
        review: 'Excellent build quality! Fits my desk setup perfectly and the light temperature is very comfortable for night work.',
        userId: user1.id,
        productId: 'prod_1',
        orderId: order1.id,
      },
      {
        rating: 5.0,
        review: 'Super clear sound and bass response. Easily paired with my phone and smart home network.',
        userId: user3.id,
        productId: 'prod_2',
        orderId: order1.id,
      },
      {
        rating: 4.5,
        review: 'Battery life easily lasts a whole week with heart rate monitoring on. Great value!',
        userId: user1.id,
        productId: 'prod_3',
        orderId: order2.id,
      },
    ],
  });

  console.log('✅ Created sample ratings & reviews.');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
