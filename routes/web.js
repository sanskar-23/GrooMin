const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')

// Midllewares 
const admin = require('../app/http/middlewares/admin')
const auth = require('../app/http/middlewares/auth')
const guest = require('../app/http/middlewares/guest')

function initRoutes(app) {


    app.get('/', homeController().index);
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register);
    app.post('/register', authController().postRegister)
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)
    app.post('/logout', authController().logout)


    // customer Routes
    app.post('/orders', auth, orderController().store);
    app.get('/customer/orders', auth, orderController().index);

    // Admin routes
    app.get('/admin/orders', admin, AdminOrderController().index);

}

module.exports = initRoutes;