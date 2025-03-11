const prisma = require('./src/config/prisma');

async function getWidgetId() {
  try {
    const widgets = await prisma.widget.findMany();
    console.log('Found', widgets.length, 'widgets');
    
    widgets.forEach((widget, index) => {
      console.log(`\nWidget #${index + 1}:`);
      console.log(widget);
    });
    
    if (widgets.length > 0) {
      return widgets[0].id;
    } else {
      console.log('No widgets found');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

getWidgetId(); 