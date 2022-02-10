const axios = require('axios');
const Noty = require('noty')
const initAdmin = require('./admin')
let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            theme: 'nest',
            layout: 'topRight',
            timeout: 500,
            progressBar: false,
            text: "Food Added to cart"
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            theme: 'nest',
            layout: 'topRight',
            timeout: 500,
            progressBar: false,
            text: "Something Went Wrong"
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    })
})

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 3000)
}

initAdmin();