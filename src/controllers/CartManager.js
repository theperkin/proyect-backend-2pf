import {existsSync, promises as fs} from 'fs'

class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}

export class CartManager {
    constructor(path) {
        this.path = path
    }

    checkJson = () => {
        !existsSync(this.path) && fs.writeFile(this.path, "[]", 'utf-8');
    }

    addCart = async () => {
        this.checkJson()
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            let carts = JSON.parse(read)
            let newId
            carts.length > 0 ? newId = carts[carts.length - 1].id + 1 : newId = 1;
            const nuevoCarrito = new Cart (newId, []);
            carts.push(nuevoCarrito);
            await fs.writeFile(this.path, JSON.stringify(carts))
            console.log(`Carrito ID: ${nuevoCarrito.id} creado`)
            return newId
        } catch {
            return "Error al crear el carrito."
        }
            
    }

    getCartById = async (idCart) => {
        this.checkJson()
        try {
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let cartIndex = carts.findIndex(cart => cart.id === idCart);
            
            if (carts[cartIndex]) {
                return carts[cartIndex]
            } else {
                throw `Carrito con ID: ${cart.id} inexistente.`
            }
        } catch {
            return "Carrito no encontrado."
        }           
    }

    addProductToCart = async (idCart, idProduct, prodQty) => {
        this.checkJson()
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex === -1) {
                objetoCarrito.products.push({product: idProduct, quantity: prodQty})
                carts[cartIndex] = objetoCarrito;
            } else {
                carts[cartIndex].products[prodIndex].quantity += prodQty;
            }
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return "Producto agregado con exito."
        } else {
            return "Error al agregar el producto al carrito."
        }
    }

    deleteCart = async (id) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carts.some(cart => cart.id === parseInt(id))) {
            const cartsFiltrados = carts.filter(cart => cart.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(cartsFiltrados))
            return "Carrito eliminado."
        } else {
            return "Carrito no encontrado."
        }
    }

    deleteProductFromCart = async (idCart, idProduct) => {
        this.checkJson()
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex !== -1) {
                const prodsFiltrados = objetoCarrito.products.filter(obj => obj.product !== parseInt(idProduct))
                objetoCarrito.products = prodsFiltrados;
                carts[cartIndex] = objetoCarrito;
            } else {
                return "Producto inexistente."
            }
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return "Producto eliminado del carrito con exito."
        } else {
            return "Error al eliminar el producto del carrito."
        }
    }
}