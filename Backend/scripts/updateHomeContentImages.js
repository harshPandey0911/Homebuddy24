const dotenv = require('dotenv');
const connectDB = require('../config/db');
const HomeContent = require('../models/HomeContent');

dotenv.config();

const Homebuddy24Urls = {
  "banner": [
    {
      "filename": "homepage-banner.png",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135844/Homebuddy24/HomeContent/banner/homepage-banner.png"
    },
    {
      "filename": "Winter-banner.png",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135846/Homebuddy24/HomeContent/banner/Winter-banner.png"
    }
  ],
  "curated-services": [
    {
      "filename": "ac-repair-service.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135847/Homebuddy24/HomeContent/curated-services/ac-repair-service.jpg"
    },
    {
      "filename": "electrical-panel-upgrade.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135848/Homebuddy24/HomeContent/curated-services/electrical-panel-upgrade.jpg"
    },
    {
      "filename": "home-wiring.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135849/Homebuddy24/HomeContent/curated-services/home-wiring.jpg"
    },
    {
      "filename": "smart home setup.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135850/Homebuddy24/HomeContent/curated-services/smart-home-setup.jpg"
    }
  ],
  "most-booked-services": [
    {
      "filename": "automatic-top-load-machine.webp",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135851/Homebuddy24/HomeContent/most-booked-services/automatic-top-load-machine.webp"
    },
    {
      "filename": "dreill&hang.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135852/Homebuddy24/HomeContent/most-booked-services/dreill-hang.webp"
    },
    {
      "filename": "fan-repairs.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135853/Homebuddy24/HomeContent/most-booked-services/fan-repairs.webp"
    },
    {
      "filename": "haircut-men.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135854/Homebuddy24/HomeContent/most-booked-services/haircut-men.webp"
    },
    {
      "filename": "intense-bathroom-2.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135855/Homebuddy24/HomeContent/most-booked-services/intense-bathroom-2.webp"
    },
    {
      "filename": "intense-bathroom-3.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135856/Homebuddy24/HomeContent/most-booked-services/intense-bathroom-3.webp"
    },
    {
      "filename": "roll-on-wax.webp",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135857/Homebuddy24/HomeContent/most-booked-services/roll-on-wax.webp"
    },
    {
      "filename": "spacula-waxing.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135858/Homebuddy24/HomeContent/most-booked-services/spacula-waxing.webp"
    },
    {
      "filename": "switch-board.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135859/Homebuddy24/HomeContent/most-booked-services/switch-board.webp"
    },
    {
      "filename": "tap-repai.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135860/Homebuddy24/HomeContent/most-booked-services/tap-repai.webp"
    }
  ],
  "new-and-noteworthy": [
    {
      "filename": "ac-repair.png",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135862/Homebuddy24/HomeContent/new-and-noteworthy/ac-repair.png"
    },
    {
      "filename": "bathroom-cleaning.png",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135863/Homebuddy24/HomeContent/new-and-noteworthy/bathroom-cleaning.png"
    },
    {
      "filename": "hair-studio.png",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135864/Homebuddy24/HomeContent/new-and-noteworthy/hair-studio.png"
    },
    {
      "filename": "water-purifiers.png",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135865/Homebuddy24/HomeContent/new-and-noteworthy/water-purifiers.png"
    }
  ],
  "promo-carousel": [
    {
      "filename": "1678450687690-81f922.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135866/Homebuddy24/HomeContent/promo-carousel/1678450687690-81f922.webp"
    },
    {
      "filename": "1678454437383-aa4984.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135868/Homebuddy24/HomeContent/promo-carousel/1678454437383-aa4984.webp"
    },
    {
      "filename": "1711428209166-2d42c0.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135869/Homebuddy24/HomeContent/promo-carousel/1711428209166-2d42c0.webp"
    },
    {
      "filename": "1745822547742-760034.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135870/Homebuddy24/HomeContent/promo-carousel/1745822547742-760034.webp"
    },
    {
      "filename": "1762785595543-540198.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135871/Homebuddy24/HomeContent/promo-carousel/1762785595543-540198.webp"
    },
    {
      "filename": "1764052270908-bae94c.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135873/Homebuddy24/HomeContent/promo-carousel/1764052270908-bae94c.webp"
    }
  ],
  "electrical-installation-repair": [
    {
      "filename": "home-wiring.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135874/Homebuddy24/HomeContent/electrical-installation-repair/home-wiring.jpg"
    },
    {
      "filename": "electrical-panel-upgrade.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135875/Homebuddy24/HomeContent/electrical-installation-repair/electrical-panel-upgrade.jpg"
    },
    {
      "filename": "smart home setup.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135876/Homebuddy24/HomeContent/electrical-installation-repair/smart-home-setup.jpg"
    }
  ],
  "appliance-repair-service": [
    {
      "filename": "ac-repair.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135877/Homebuddy24/HomeContent/appliance-repair-service/ac-repair.jpg"
    },
    {
      "filename": "washing-machine-repair].jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135878/Homebuddy24/HomeContent/appliance-repair-service/washing-machine-repair-.jpg"
    },
    {
      "filename": "water heater repair.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135879/Homebuddy24/HomeContent/appliance-repair-service/water-heater-repair.jpg"
    }
  ],
  "home-repair-installation": [
    {
      "filename": "wiring.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135880/Homebuddy24/HomeContent/home-repair-installation/wiring.jpg"
    },
    {
      "filename": "switch&socket.jpg",
      "url": "https://res.cloudinary.com/shubhamcloudinary/image/upload/v1766135884/Homebuddy24/HomeContent/home-repair-installation/switch-socket.jpg"
    }
  ]
};

const updateHomeContentImages = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Find existing HomeContent
    const homeContent = await HomeContent.findOne();
    if (!homeContent) {
      console.log('❌ No HomeContent found in database');
      return;
    }

    console.log('📝 Updating HomeContent images with Homebuddy24 URLs...\n');

    // Update banners if they exist
    if (homeContent.banners && homeContent.banners.length > 0) {
      console.log('📸 Updating banners...');
      homeContent.banners.forEach((banner, index) => {
        if (Homebuddy24Urls.banner && Homebuddy24Urls.banner[index]) {
          banner.imageUrl = Homebuddy24Urls.banner[index].url;
          console.log(`  ✅ Banner ${index + 1}: ${Homebuddy24Urls.banner[index].url}`);
        }
      });
    }

    // Update promos if they exist
    if (homeContent.promos && homeContent.promos.length > 0) {
      console.log('🎠 Updating promos...');
      homeContent.promos.forEach((promo, index) => {
        if (Homebuddy24Urls['promo-carousel'] && Homebuddy24Urls['promo-carousel'][index]) {
          promo.imageUrl = Homebuddy24Urls['promo-carousel'][index].url;
          console.log(`  ✅ Promo ${index + 1}: ${Homebuddy24Urls['promo-carousel'][index].url}`);
        }
      });
    }

    // Update curated services if they exist
    if (homeContent.curated && homeContent.curated.length > 0) {
      console.log('🎯 Updating curated services...');
      homeContent.curated.forEach((item, index) => {
        if (Homebuddy24Urls['curated-services'] && Homebuddy24Urls['curated-services'][index]) {
          item.gifUrl = Homebuddy24Urls['curated-services'][index].url;
          console.log(`  ✅ Curated ${index + 1}: ${Homebuddy24Urls['curated-services'][index].url}`);
        }
      });
    }

    // Update noteworthy services if they exist
    if (homeContent.noteworthy && homeContent.noteworthy.length > 0) {
      console.log('⭐ Updating noteworthy services...');
      homeContent.noteworthy.forEach((item, index) => {
        if (Homebuddy24Urls['new-and-noteworthy'] && Homebuddy24Urls['new-and-noteworthy'][index]) {
          item.imageUrl = Homebuddy24Urls['new-and-noteworthy'][index].url;
          console.log(`  ✅ Noteworthy ${index + 1}: ${Homebuddy24Urls['new-and-noteworthy'][index].url}`);
        }
      });
    }

    // Update most booked services if they exist
    if (homeContent.booked && homeContent.booked.length > 0) {
      console.log('📦 Updating most booked services...');
      homeContent.booked.forEach((item, index) => {
        if (Homebuddy24Urls['most-booked-services'] && Homebuddy24Urls['most-booked-services'][index]) {
          item.imageUrl = Homebuddy24Urls['most-booked-services'][index].url;
          console.log(`  ✅ Booked ${index + 1}: ${Homebuddy24Urls['most-booked-services'][index].url}`);
        }
      });
    }

    // Update category sections if they exist
    if (homeContent.categorySections && homeContent.categorySections.length > 0) {
      console.log('📂 Updating category sections...');
      homeContent.categorySections.forEach((section, sectionIndex) => {
        let sectionKey = '';
        if (section.title === 'Electrical Installation & Repair') {
          sectionKey = 'electrical-installation-repair';
        } else if (section.title === 'Appliance repair & service') {
          sectionKey = 'appliance-repair-service';
        } else if (section.title === 'Home repair & installation') {
          sectionKey = 'home-repair-installation';
        }

        if (sectionKey && Homebuddy24Urls[sectionKey] && section.cards) {
          section.cards.forEach((card, cardIndex) => {
            if (Homebuddy24Urls[sectionKey][cardIndex]) {
              card.imageUrl = Homebuddy24Urls[sectionKey][cardIndex].url;
              console.log(`  ✅ ${section.title} - Card ${cardIndex + 1}: ${Homebuddy24Urls[sectionKey][cardIndex].url}`);
            }
          });
        }
      });
    }

    // Save the updated HomeContent
    await homeContent.save();
    console.log('\n🎉 HomeContent images updated successfully!');
    console.log('✅ All homepage images now use Homebuddy24/HomeContent URLs');

  } catch (error) {
    console.error('❌ Error updating HomeContent:', error);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

updateHomeContentImages();
