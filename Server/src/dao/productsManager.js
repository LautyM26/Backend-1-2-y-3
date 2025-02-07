import fs from "fs"

class ProductsManager{
    #path=""
    constructor(rutaArchivo){
        this.#path=rutaArchivo
    }

    async getProducts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }

    async addProduct(product) {
        const products = await this.getProducts()
 
        const { title, description, code, price, status, stock, category } = product
        if (!title || !description || !code || price == null || status == null || stock == null || !category) {
            throw new Error("Todos los campos son obligatorios: title, description, code, price, status, stock, category")
        }
 
        const codeExists = products.some(p => p.code === code)
        if (codeExists) {
            throw new Error(`El código ${code} ya existe, usa otro.`)
        }
 
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
 
        const newProduct = {
            id: newId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        };
 
        products.push(newProduct)
     
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
 
        return newProduct
    }
 
    async getProductById(id) {
        const products = await this.getProducts()
        const producto = products.find(p => p.id === Number(id))
        if (!producto) {
            return null 
        }
        return producto
    }
    async updateProductById(id, updatedFields) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === Number(id))
 
        if (productIndex === -1) {
            return null 
        }
        products[productIndex] = {
            ...products[productIndex],
            ...updatedFields,
            id: products[productIndex].id 
        };
 
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 5))
        return products[productIndex]
    }
 
    async deleteProductById(id) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === Number(id))
 
        if (productIndex === -1) {
            return null
        }
 
        const deletedProduct = products.splice(productIndex, 1)
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 5))
        return deletedProduct[0]
    }

    async cargaDeProducts() {
     
     filePath = "./src/data/products.json"
      loadProducts = () => {
         try {
             const data = fs.readFileSync(filePath, "utf-8")
             return JSON.parse(data)
         } catch (err) {
             console.error("Error loading products:", err)
             return []
         }
     };   
    }
}

const productsManager = new ProductsManager("./src/data/products.json")

export default productsManager