const Cart = require('./cart');

const db = require('../until/database');
module.exports = class {
    constructor(
        id,
        title,
        imageUrl,
        description,
        price
    ) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]);
    }

    static deleteById(id) {}

    static fetcAll() {
        return db.execute('select * from products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products where products.id = ?', [id]);
    }
}