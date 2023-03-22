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

const p1 = new Product ("Calzado","Marca Puro",1000,"#10",5,"A/A",true,[]);
const p2 = new Product ("Calzado","Marca Puro",1000,"#11",8,"A/A",true,[]);
const p3 = new Product ("Calzado","Marca Puro",2500,"#12",7,"A/A",true,[]);
const p4 = new Product ("Calzado","Marca Puro",2500,"#13",6,"A/A",true,[]);


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
            return console.log("Todos los campos deben ser completados.");
        } else {
            if (imgPath) {
                product.thumbnail = imgPath; 
            } else {
                imgPath = []
                product.thumbnail = imgPath;
            }
        let newID;
        !data.length ? (newID = 1) : (newID = data[data.length - 1].id + 1);
        const nuevoProducto = {id: newID, ...product};
        data.push(nuevoProducto);
        await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
        console.log(`El producto con id: ${nuevoProducto.id} ha sido agregado.`)
        return newID
        }
    }

    getProducts = async () => {
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            const prods = await JSON.parse(read)
            if (prods.length != 0) {
                console.log("Listado de productos:");
                console.log(prods);
                return prods
            } 
        } catch {
            await this.createJson();
            await this.createProducts();
            return "Productos iniciales creados."
        }
    }

    getProductById = async (id) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const findProduct = prods.find((prod) => prod.id === parseInt(id));
        if (findProduct) {
            console.log("Se ha encontrado el siguiente producto:")
            return findProduct;
        } else {
            return console.log("Product Not found");
        }
    }

    updateProduct = async (id, {title, description, price, code, stock, category, status, thumbnail}) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            let index= prods.findIndex(prod => prod.id === parseInt(id))
            prods[index].title = title
            prods[index].description = description
            prods[index].price = price
            prods[index].code = code
            prods[index].stock = stock
            prods[index].category = category
            prods[index].status = status
            prods[index].thumbnail = thumbnail
            await fs.writeFile(this.path, JSON.stringify(prods))
            return "Producto actualizado" 
        } else {
            return "Producto no encontrado"
        }
    }

    deleteProduct = async (id) => {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(prods.some(prod => prod.id === parseInt(id))) {
            const prodsFiltrados = prods.filter(prod => prod.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            return "Producto eliminado"
        } else {
            return "Producto no encontrado"
        }
    }

    
    async createJson() {
        await fs.writeFile(this.path, "[]");
    }

    async createProducts() {
    await this.addProduct(p1, ['../public/img/imagen1.jpg']);
    await this.addProduct(p2, ['../public/img/imagen2.JPG']);
    await this.addProduct(p3, ['../public/img/imagen3.JPG']);
    await this.addProduct(p4, ['../public/img/iamgen4.JPG']);
    }
}