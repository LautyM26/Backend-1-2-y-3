import { Router } from 'express'
import productsManager from '../dao/productsManager.js'
export const router=Router()


router.get('/', (req, res) => {
    res.render('menu'); 
});


router.get('/realTimeProducts', async(req,res)=>{

    let productos = await productsManager.getProducts()
    let numero=Math.floor(Math.random()*(productos.length)+0)
    let producto = productos[numero]

    res.render("realTimeProducts", {
        producto
    })
})


router.get('/products', async(req,res)=>{

    let productos = await productsManager.getProducts() 

    res.render("index", {
        productos
    })
})
