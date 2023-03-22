import { Router } from "express";
import { getManagerCart, getManagerProducts, getManagerUsers } from "../dao/daoManager.js";
import ManagerCartMongoDB from "../dao/MongoDB/models/Cart.js";

const routerCart = Router()

const cartManagerData = await getManagerCart()
const cartManager = new cartManagerData()

const prodManagerData = await getManagerProducts()
const prodManager = new prodManagerData()

routerCart.get('/:cid', async (req, res) => { 
    try {
        const cart = await cartManager.getElementById(req.params.cid)
        const popCart = await cart.populate({path:'products.productId', model: cartManager.productModel})
        
        res.send({
            status: "success",
            payload: popCart
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
})


routerCart.post('/', async (req, res) => { 
    try {
        const cart = {}
        const newCart = await cartManager.addElements(cart)
        res.send({
            status: "success",
            payload: newCart
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
})

routerCart.post('/:cid/products/:pid', async (req, res) => { 
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    
    try {
        const newProduct = await prodManager.getElementById(idProduct);
        if(newProduct) {
            console.log("llegué al if")
            const cart = await cartManager.addProductToCart(idCart, idProduct);
            
            res.send({
                status: "success",
                payload: cart
            })
        } else {
            res.send({
                status: "error",
                payload: `Product ${idProduct} not found.`
            })
        }
        
    } catch (error) {
        res.send({
            status: "error",
            payload: `Product ${idProduct} was not added.`
        })
    }
})

routerCart.put('/:cid', async (req, res) => { 
    try {
        const cartData = await cartManager.getElementById((req.params.cid));
        const prodArray = req.body

        const addedProducts = await ManagerCartMongoDB.addProductToCart(cartData, prodArray)

        res.send({
            status: "success",
            payload: addedProducts
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
})

routerCart.put('/:cid/products/:pid', async (req, res) => { 
    try {
        const {quantity} = req.body;
        const updatedProduct = await cartManager.updateProdQty(req.params.cid, req.params.pid, quantity);

        res.send({
            status: "success",
            payload: updatedProduct
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
})

routerCart.delete('/:cid', async (req, res) => {
    try {
        const cartData = await cartManager.getElementById((req.params.cid))
        const emptyCart = await ManagerCartMongoDB.deleteAllProducts(cartData)

        res.send({
            status: "success",
            payload: emptyCart
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
})
routerCart.delete('/:cid/products/:pid', async (req, res) => { 
    try {
        const cartData = await cartManager.getElementById((req.params.cid))
        const productData = await prodManager.getElementById((req.params.pid))

        const updatedCart = await ManagerCartMongoDB.deleteProductFromCart(cartData, productData)

        res.send({
            status: "success",
            payload: updatedCart
        })
    
    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }    
})


export default routerCart;