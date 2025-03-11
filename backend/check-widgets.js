const prisma = require('./src/config/prisma');

async function getWidgets() {
  try {
    const widgets = await prisma.widget.findMany();
    console.log('Found', widgets.length, 'widgets:');
    
    widgets.forEach((widget, index) => {
      console.log(`\nWidget #${index + 1}:`);
      console.log('ID:', widget.id);
      console.log('Name:', widget.name);
      console.log('Color:', widget.color);
      console.log('Position:', widget.position);
      console.log('Welcome Message:', widget.welcomeMessage);
      console.log('User ID:', widget.userId);
    });
    
  } catch (error) {
    console.error('Error fetching widgets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getWidgets(); 