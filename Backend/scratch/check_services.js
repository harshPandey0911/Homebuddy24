const mongoose = require('mongoose');
require('../models/Service');
require('../models/Vendor');

async function check() {
  await mongoose.connect('mongodb+srv://harshpandey09112004_db_user:harshpandey09112004_db_user@civil.oc2iez2.mongodb.net/test?retryWrites=true&w=majority');
  
  console.log('--- All Vendor Services in test ---');
  const services = await mongoose.model('Service').find({ vendorId: { $ne: null } })
    .populate('vendorId', 'name businessName')
    .select('title slug vendorId basePrice');
  console.log(JSON.stringify(services, null, 2));

  process.exit();
}

check();
