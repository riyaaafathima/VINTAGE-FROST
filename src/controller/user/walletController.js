const walletModel = require("../../model/user/wallet");
const userModel = require('../../model/user/user');
const cartModel = require('../../model/user/cart');

const walletPageRender = async (req, res) => {
    try {
        if (!req.session?.user) {
            return res.redirect('/login');  // Redirect if user not logged in
        }

        const userId = req.session.user._id;

        // Find the user's wallet and populate the transaction field
        const wallet = await walletModel
            .findOne({ user: userId })
            .populate('transaction.orderId') 
            .populate('transaction.product');

        let cartCount = 0;
        let username = '';

        const user = await userModel.findById(userId);
        if (user) {
            username = user.username;
            const cart = await cartModel.findOne({ user: userId });
            if (cart) {
                cartCount = cart.items.length;
            }
        }

        // Send the wallet data to the frontend
        res.render('user/wallet', {
            wallet,           // Send the specific wallet
            transactions: wallet?.transaction || [],   // Send the transactions
            user: username,
            cartCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

module.exports = { walletPageRender };
