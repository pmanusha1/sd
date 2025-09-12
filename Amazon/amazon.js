const AccountStatus = Object.freeze({
    active: "active",
    blocked: "blocked",
    closed: "closed"
})

const ProductCatergory = Object.freeze({
    clothing: "clothing",
    electronics: "electronics",
    gocery: "gocery"
})

const OrderStatus = Object.freeze({
    packed: "packed",
    shipped: "packed",
    outfordelivery: "packed",
    deliverd: "packed",
    cancel: "packed",
})

const notifyType = Object.freeze({
    email: "email",
    message: "message"
})

class Customer {
    constructor(id, shoppingCart, search) {
        this.id = id
        this.shoppingCart = shoppingCart
        this.search = search
    }

    getShoppingCart() {
        return this.shoppingCart.getItems()
    }
    addItemsToShoppingCart(item) {
        this.shoppingCart.addItems(item)
    }
    modifyItemsInShoppingCart(itemId, update) {
        const items = this.shoppingCart.getItems()
        const itemToModify = items.find(item => item.id === itemId)
        if(itemToModify) {
            this.shoppingCart.updateItem(itemToModify, update)
        }
    }
    removeItemsFromShoppingCart(itemId) {
        const items = this.shoppingCart.getItems
        const itemToDelete = items.find(item => item.id === itemId)
        if(itemToDelete) {
            this.shoppingCart.deleteItems(itemToDelete)
        }
    }
}

class Guest extends Customer {
    constructor(id, shoppingCart, search) {
        super(id, shoppingCart, search)
    }

    createAccount(username, email, shippingAddress, accountStatus) {
        return new Account(username, email, shippingAddress, accountStatus)
    }
}

class User extends Customer {
    constructor(id, shoppingCart, search, account) {
        super(id, shoppingCart, search)
        this.account = account
    }
}

class Seller extends User {
    constructor(id, shoppingCart, search, account) {
        super(id, shoppingCart, search, account)
    }

    addProduct(id, name, desc, cost, seller, productCatergory, productReviews = [], qty) {
        const product = Product(id, name, desc, cost, seller, productCatergory, productReviews)
        const item = new Item(product, qty)
        return item
    }
}

class Buyer extends User {
    constructor(id, shoppingCart, search, account, order) {
        super(id, shoppingCart, search, account)
        this.order = order
    }

    orderProduct(id, orderItems, buyer, seller, orderDate, orderStatus, sendNotification) {
        const order = new Order(
            id,
            orderItems,
            buyer,
            seller,
            orderDate,
            orderStatus,
            sendNotification
        )

        this.order = order
    }
    addReview(rating) {
        return new ProductReview(Date.now(), this, rating)
    }
}

class Account {
    constructor(username, email, shippingAddress = [], accountStatus) {
        this.username = username
        this.email = email
        this.shippingAddress = shippingAddress
        this.accountStatus = accountStatus
    }
}

class Address {
    constructor(pin, street, area, city, country) {
        this.pin = pin
        this.street = street
        this.area = area
        this.city = city
        this.country = country
    }
}

class ShoppingCart {
    constructor(items = [], cartValue = 0) {
        this.items = items
        this.cartValue = cartValue
    }

    addItems(item) {
        this.items.push(item)
        this.updateCartValue()
    }
    updateItem(itemToModify, newQty) {
        itemToModify.qty = newQty
        this.updateCartValue()
    }
    deleteItems(itemToDelete) {
        this.items = this.items.filter(item => item !== itemToDelete)
        this.updateCartValue()
    }
    checkOutItems() {
        const CheckedOutItems = [...this.items]
        this.items = []
        this.cartValue = 0
        return CheckedOutItems
    }
    getCartValue() {
        return this.cartValue
    }
    getItems() {
        return this.items
    }

    updateCartValue() {
        this.cartValue = this.items.reduce((total, item) => total + item.product.cost * item.qty, 0)
    }
}

class Item {
    constructor(product, qty) {
        this.product = product
        this.qty = qty
    }
}

class Product {
    constructor(id, name, desc, cost, seller, productCatergory, productReviews = []) {
        this.id = id 
        this.name = name
        this.desc = desc
        this.cost = cost
        this.seller = seller
        this.productCatergory = productCatergory
        this.productReviews = productReviews
    }
}

class ProductReview {
    constructor(id, buyer, rating) {
        this.id = id
        this.buyer = buyer
        this.rating = rating
    }
}

class Search {
    constructor(products = []) {
        this.products = products
    }
    getProductByName(productName) {
        return this.products.filter(product => product.name.toLowerCase().includes(productName.toLowerCase()))
    }
    getProductByCategory(catergory) {
        return this.products.filter(product => product.productCatergory === catergory)
    }
}

class Order {
    constructor(id, orderItems, orderDate, orderStatus, sendNotification) {
        this.id = id
        this.orderItems = orderItems
        this.orderDate = orderDate
        this.orderStatus = orderStatus
        this.sendNotification = sendNotification
    }

    orderStatus() {
        return this.orderStatus
    }
    trackOrder() {
        return `Tracking: Order is currently ${this.orderStatus}`
    }
    payment(amount) {
        return `Payment of $${amount} completed`;
    }
}

class SendNotification {

    sendNotification(notifyDomin) {
        switch (notifyDomin.notifyType()) {
            case notifyType.email:
                this.notifyObj = new EmailNotify()
                this.message = new Message("Notification sent via email")
                break;
            case notifyType.message:
                this.notifyObj = new MessageNotify()
                this.message = new Message("Notification sent via message")
            default:
                break;
        }
        this.notifyObj.sendNotification(this.message)
    }
}

class Notify {
    sendNotification() {
        throw new Error("sendNotification must be implemented by subclasses");
    }
}

class EmailNotify extends Notify {
    sendNotification(message) {
        console.log(`Email: ${message.content}`);
    }
}

class MessageNotify extends Notify {
    sendNotification(message) {
        console.log(`Message: ${message.content}`);
    }
}

class Message {
    constructor(content = "") {
        this.content = content
    }
}

const buyerAddress = new Address(500089, "Alkapur", "Manikonda", "hyderabad", "India")
const sellerAddress = new Address(505326, "Ambedkar Nagar", "Korutla", "Jagtial", "India")

const sellerAccount = new Account('seller', 'seller@gmail.com', [sellerAddress], AccountStatus.active)
const buyerAccount = new Account('manusha', 'manusha@gmail.com', [buyerAddress], AccountStatus.active)

const search = new Search()
const shoppingCart = new ShoppingCart()
const seller = new Seller(23, shoppingCart, search, sellerAccount)

const product = new Product(56, "MacBook", "MacBook Air M1", 60000, seller, ProductCatergory.electronics, [])
const item = new Item(product, 1)

search.products.push(product)

console.log("Search result:", search.getProductByName("MacBook"))

shoppingCart.addItems(item)

const buyer = new Buyer(24, shoppingCart, search, buyerAccount, null)

const notifyDomin = {
    notifyType: () => notifyType.email
}

const notificationService = new SendNotification()

notificationService.sendNotification(notifyDomin)

const order = new Order(87, item, new Date(), OrderStatus.packed, notificationService)
buyer.order = order

console.log(buyer.order.trackOrder())
