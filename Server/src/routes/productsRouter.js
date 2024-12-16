import express from "express";
import productsManager from "../dao/productsManager.js"; 

const router = express.Router();


router.get("/", async (req, res) => {

    let products = await productsManager.getProducts();

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: products });
});


router.get("/:pid", async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (isNaN(pid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `Complete un pid numérico` });
    }

    try {
        let product = await productsManager.getProductById(pid);
        if (!product) {
            res.setHeader("Content-Type", "application/json");
            return res.status(404).json({ error: `No existe producto con pid ${pid}` });
        }

        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.post("/", async (req, res) => {
    const newProductData = req.body;

    try {
        const newProduct = await productsManager.addProduct(newProductData);

        return res.status(201).json({
            message: "Producto agregado exitosamente",
            product: newProduct
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    if (updatedFields.id) {
        return res.status(400).json({ error: "El campo 'id' no se puede actualizar" });
    }

    try {
        const updatedProduct = await productsManager.updateProductById(pid, updatedFields);
        if (!updatedProduct) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }

        return res.status(200).json({
            message: `Producto con ID ${pid} actualizado correctamente`,
            product: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const deletedProduct = await productsManager.deleteProductById(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }

        return res.status(200).json({
            message: `Producto con ID ${pid} eliminado correctamente`,
            product: deletedProduct
        });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
