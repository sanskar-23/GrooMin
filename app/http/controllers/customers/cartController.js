function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart');
        },
        update(req, res) {
            // for the first time adding cart and adding basic structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
                // check if item already exist in the cart or not
            return res.json({ data: 'All ok' })
        }
    }
}

module.exports = cartController;