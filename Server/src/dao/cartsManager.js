import fs from "fs"

class CartsManager {
    #path = ""

    constructor(filePath) {
        this.#path = filePath
    }

    async getCarts() {
        if (fs.existsSync(this.#path)) {
            const cartsData = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(cartsData)
        }
        return [];
    }

    async saveCarts(carts) {
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))
    }

    async createCart() {
        const carts = await this.getCarts()
        const newCart = {
            id: carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1,
            products: [],
        };

        carts.push(newCart)
        await this.saveCarts(carts)
        return newCart
    }

    async getCartById(cid) {
        const carts = await this.getCarts()
        return carts.find((cart) => cart.id === Number(cid)) || null
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex((cart) => cart.id === Number(cid))

        if (cartIndex === -1) return null

        const cart = carts[cartIndex]
        const existingProduct = cart.products.find((prod) => prod.product === Number(pid))

        if (existingProduct) {
            existingProduct.quantity += 1
        } else {
            cart.products.push({ product: Number(pid), quantity: 1 })
        }

        carts[cartIndex] = cart
        await this.saveCarts(carts)
        return cart;
    }
}

export default CartsManager