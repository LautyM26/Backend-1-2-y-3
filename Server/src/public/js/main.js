const socket = io()

socket.on("actualizarProductos", (producto) => {
    const tbody = document.getElementById("productos-body")

    const newRow = document.createElement("tr")
    newRow.innerHTML = `
        <td>${producto.title}</td>
        <td>${producto.description}</td>
        <td>$${producto.price}</td>
        <td>${producto.category}</td>
        <td>
            <a href="/products/${producto.id}" class="btn btn-info">Ver detalles</a>
            <button class="btn btn-success add-to-cart" data-id="${producto.id}">Agregar al carrito</button>
        </td>
    `
    tbody.appendChild(newRow)
})


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", async (event) => {
            const productId = event.target.getAttribute("data-id")
            let cartId = localStorage.getItem("cartId")

            if (!cartId) {
                try {
                    const response = await fetch("/api/carts", { method: "POST" })
                    const data = await response.json()
                    cartId = data.cartId
                    localStorage.setItem("cartId", cartId)
                } catch (error) {
                    console.error("Error al crear carrito:", error)
                    alert("Hubo un problema al crear el carrito.")
                    return
                }
            }

            try {
                const res = await fetch(`/api/carts/${cartId}/products/${productId}`, { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                })                

                if (res.ok) {
                    alert("✅ Producto agregado al carrito")
                } else {
                    alert("❌ Error al agregar producto al carrito")
                }
                
            } catch (error) {
                console.error("Error al agregar producto:", error)
                alert("Hubo un problema al agregar el producto.")
            }
        })
    })
})