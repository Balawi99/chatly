// Another test endpoint
module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'API test endpoint is working!',
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
}; 