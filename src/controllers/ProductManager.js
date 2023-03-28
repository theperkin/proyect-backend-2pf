import {promises as fs} from 'fs'

class Product {
    constructor(title, description, price, code, stock, category, status, thumbnail) {
        this.id = Product.addId()
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status;
        this.thumbnail = thumbnail;
    }

    static addId(){
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}


const p1 = new Product ("Chismosa Acuario","Ojota",10000,"#120",10,"A1",true,[]);
const p2 = new Product ("Chismosa Acuario","Ojota",10000,"#121",15,"A1",true,[]);
const p3 = new Product ("Chismosa Acuario","Ojota",10000,"#122",20,"A1",true,[]);
const p4 = new Product ("Chismosa Acuario","Ojota",10000,"#123",25,"A1",true,[]);


export class ProductManager {
    constructor(path) {
        this.path = path
    }

    addProduct = async (product,imgPath) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const prodCode = data.map((prod) => prod.code);
        const prodExist = prodCode.includes(product.code); 
        if (prodExist) {
            return console.log (`El código ${product.code} ya existe. Ingrese uno diferente.`)
        } else if (Object.values(product).includes("") || Object.values(product).includes(null)) {
            return console.log("Verificar campos.");
        } else {
            if (imgPath) {
                product.thumbnail = imgPath;
            }            
            const nuevoProducto = {id: Product.addId(), ...product};
            data.push(nuevoProducto);
            await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
            return console.log(`Producto ID: ${nuevoProducto.id} agregado con exito.`) 
        }
    }

    getProducts = async () => {
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            const prods = await JSON.parse(read)
            if (prods.length != 0) {
                console.log("Lista de productos: ");
                return prods
            } 
        } catch {
            await this.createJson();
            await this.createProducts();
            return "Productos creados."
        }
    }

    getProductById = async (id) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const findProduct = prods.find((prod) => prod.id === parseInt(id));
        if (findProduct) {
            console.log("Product: ")
            return findProduct;
        } else {
            return console.log("Error Product");
        }
    }

    updateProduct = async (id, {title, description, price, thumbnail, code, stock, category, status}) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            let index= prods.findIndex(prod => prod.id === parseInt(id))
            prods[index].title = title
            prods[index].description = description
            prods[index].price = price
            prods[index].thumbnail = thumbnail
            prods[index].code = code
            prods[index].stock = stock
            prods[index].category = category
            prods[index].status = status
            await fs.writeFile(this.path, JSON.stringify(prods))
            return "Producto actualizado." 
        } else {
            return "Producto no encontrado."
        }
    }

    deleteProduct = async (id) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            const prodsFiltrados = prods.filter(prod => prod.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            return "Producto eliminado."
        } else {
            return "Producto no encontrado."
        }
    }

    
    async createJson() {
        await fs.writeFile(this.path, "[]");
    }

    async createProducts() {
    await this.addProduct(p1, ['../public/img/Imagen1.jpg']);
    await this.addProduct(p2, ['../public/img/Imagen1.jpg']);
    await this.addProduct(p3, ['../public/img/Imagen1.jpg']);
    await this.addProduct(p4, ['../public/img/Imagen1.jpg']);
    }
}