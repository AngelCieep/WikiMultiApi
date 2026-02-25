const connectDB = require('../database');
const Universe = require('../models/universe.model');

(async () => {
  await connectDB();
  const u = await Universe.findOne({ $or: [{ name: /resident/i }, { slug: /resident/i }] });
  console.log(JSON.stringify(u, null, 2));
  process.exit(0);
})();
