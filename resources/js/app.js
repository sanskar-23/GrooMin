const axios = require('axios');
const Noty = require('noty');
const { createIndexes } = require('../../app/models/user');
const initAdmin = require('./admin')
const moment = require('moment');
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

// Change Order Status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed');
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current');
            }
        }
    })
}

updateStatus(order)

// socket for client side
let socket = io();

// create a room for every order 

if (order) {
    socket.emit('join', `order_${order._id}`)
}