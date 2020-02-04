const monggodb = require('mongodb');
const getDb = require('../until/database').getDb;

const ObjectId = monggodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        console.log(cartProductIndex);

        const updateCartItems = [...this.cart.items];
        let newQuantity = 1;
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updateCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updateCartItems.push({
                productId: new ObjectId(product._id),
                quantity: 1
            });
        }
        const updateCart = {
            items: updateCartItems
        };
        const db = getDb();
        return db.collection('users').updateOne({
            _id: new ObjectId(this._id)
        }, {
            $set: {
                cart: updateCart
            }
        });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        return db.collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                })
            })
            .catch(err => console.log(err));
    }

    deleteItemFromCart(productId) {
        const updateCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users')
            .updateOne({
                _id: new ObjectId(this._id)
            }, {
                $set: {
                    cart: {
                        items: updateCartItems
                    }
                }
            })
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.username
                    }
                }
                return db.collection('orders').insertOne(order)
            })
            .then(result => {
                this.cart = {
                    items: []
                };
                return db.collection('users')
                    .updateOne({
                        _id: new ObjectId(this._id)
                    }, {
                        $set: {
                            cart: {
                                items: []
                            }
                        }
                    })
            })
            .catch(err => console.log(err));
    }

    getOrder() {
        const db = getDb();
        return db.collection('orders')
            .find({
                'user._id': new ObjectId(this._id)
            })
            .toArray()
            .then()
            .catch(err => console.log(err));
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({
                _id: new ObjectId(userId)
            })
            // .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err))
    }
}
module.exports = User;