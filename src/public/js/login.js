const form = document.getElementById('idForm');
const tableBody = document.querySelector("#productsTable tbody");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const datForm = new FormData(e.target);
    const user = Object.fromEntries(datForm);
    console.log('usuario:', user);
    e.target.reset();
});