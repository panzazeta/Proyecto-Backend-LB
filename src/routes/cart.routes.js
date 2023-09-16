import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router()

cartRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const cart = await cartModel.findById(id)
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
})

cartRouter.post('/', async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid) //Busco si existe en LA BDD, no en el carrito

            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() === pid); //Busco si existe en el carrito
                if (indice != -1) {
                    cart.products[indice].quantity = quantity //Si existe en el carrito modifico la cantidad
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity }) //Si no existe, lo agrego al carrito
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart) //Actualizar el carrito
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Product Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart not Found' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
})

//las 4 nuevas rutas de la segunda entrega:

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const prod = await productModel.findById(pid);

            if (prod) {
                cart.products = cart.products.filter(item => item.id_prod._id.toString() !== pid); 
                await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado del carrito' });
            } else {
                res.status(404).send({ respuesta: 'Error al eliminar producto del Carrito', mensaje: 'Product Not Found' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error al eliminar producto del Carrito', mensaje: 'Cart Not Found' });
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error al eliminar producto del Carrito', mensaje: error });
    }
});
           

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const newProducts = req.body;

    try {
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).send({ respuesta: 'Error en actualizar carrito', mensaje: 'Cart Not Found' });
        }

        if (!Array.isArray(newProducts)) {
            return res.status(400).send({ respuesta: 'Error en actualizar carrito', mensaje: 'Please send a valid array' });
        }

        newProducts.forEach((newProduct) => {
            const { id_prod, quantity } = newProduct;
            const isProductIndex = cart.products.findIndex(item => item.id_prod === id_prod);

            if (isProductIndex !== -1) {
               cart.products[isProductIndex].quantity = quantity;
            } else {
               cart.products.push({ id_prod, quantity });
            }
        });

        const updatedCart = await cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: 'OK', mensaje: updatedCart });

    } catch (error) {
        console.error(error);
        res.status(400).send({ respuesta: 'Error en actualizar carrito', mensaje: error.message });
    }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const indice = cart.products.findIndex(item => item.id_prod._id.toString() === pid);
            if (indice !== -1) {
                cart.products[indice].quantity = quantity;
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
            } else {
                res.status(404).send({ respuesta: 'Error al actualizar producto en el Carrito', mensaje: 'Product Not Found in Cart' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error al actualizar producto en el Carrito', mensaje: 'Cart Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error al actualizar producto en el Carrito', mensaje: error });
    }
});

cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito vaciado', cart });
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar productos del carrito', mensaje: 'Cart Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error en eliminar productos del carrito', mensaje: error });
    }
});

export default cartRouter