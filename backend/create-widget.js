const prisma = require('./src/config/prisma');

async function createWidget() {
  try {
    // أولاً، دعنا نتحقق من وجود مستخدم
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // إنشاء مستخدم إذا لم يكن موجودًا
      console.log('Creating a test user...');
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'password123' hashed
        }
      });
      console.log('Test user created:', user);
    }
    
    // إنشاء ويدجت
    console.log('Creating a test widget...');
    const widget = await prisma.widget.create({
      data: {
        name: 'Test Widget',
        color: '#4a6da7',
        position: 'right',
        welcomeMessage: 'مرحبًا! كيف يمكنني مساعدتك اليوم؟',
        userId: user.id
      }
    });
    
    console.log('Widget created successfully:');
    console.log('ID:', widget.id);
    console.log('Name:', widget.name);
    console.log('Color:', widget.color);
    console.log('Position:', widget.position);
    console.log('Welcome Message:', widget.welcomeMessage);
    console.log('User ID:', widget.userId);
    
  } catch (error) {
    console.error('Error creating widget:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createWidget(); 