const cron = require('node-cron');
const Product = require('../model/admin/product');
const CategoryOffer = require('../model/admin/categoryOffer');
const ProductOffer = require('../model/admin/productOffer');

// Schedule the job to run every day at midnight
cron.schedule('* * * * *', async () => {
    console.log('Running offer expiry check...');
    try {
        const now = new Date();

        // Find products with expired or associated offers
        const products = await Product.find({
            $or: [
                { productOfferModel: { $ne: null } },
                { categoryOfferModel: { $ne: null } } 
            ]
        }).populate('productOfferModel').populate('categoryOfferModel');

        for (const product of products) {
            await checkAndUpdateOffers(product, now);
        }

        console.log(`Checked and updated ${products.length} products.`);
    } catch (error) {
        console.error('Error in offer expiry job:', error);
    }
});


// Function to check and update product and category offers
const checkAndUpdateOffers = async (product, now) => {
    let isModified = false;

    // ** 1. Check for expired product offer **
    if (product.productOfferModel) {
        if (product.productOfferModel.expiryDate <= now) {
            product.productOfferModel = null;
            product.offerPercentage = undefined;
            isModified = true;
        }
    }

    // ** 2. Check for expired category offer **
    if (product.categoryOfferModel) {
        if (product.categoryOfferModel.expiryDate <= now) {
            product.categoryOfferModel = null;
            product.offerPercentage = undefined;
            isModified = true;
        }
    }

    if (!product.productOfferModel) {
        const categoryOffer = await CategoryOffer.findOne({ category_id:product.category});
        if (categoryOffer && categoryOffer.expiryDate > now ) {
          product.offerPercentage = categoryOffer.offerPercentage;
          product.categoryOfferModel=categoryOffer._id
          isModified = true;
        }
      }

      if (!product.categoryOfferModel) {
        const productOffer = await ProductOffer.findOne({product_id:product._id});
        if (productOffer && productOffer.expiryDate > now) {
          product.offerPercentage = productOffer.offerPercentage;
          product.productOfferModel=productOffer._id
          isModified = true;
        }
      }

    if (isModified) {
        await product.save();
    }
};
