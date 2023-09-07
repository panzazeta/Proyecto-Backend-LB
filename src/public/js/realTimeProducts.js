const socket = io();
const form = document.getElementById('idForm');
const tableBody = document.querySelector("#productsTable tbody");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const datForm = new FormData(e.target);
    const prod = Object.fromEntries(datForm);
    console.log('Product data:', prod);
    await socket.emit('nuevoProducto', prod);
    console.log('Socket emit done');
    e.target.reset();
});

socket.on('products-data', (products) => {
    let tableContent = '';

    products.forEach(product => {
        tableContent += `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = tableContent;
});