// const form = document.getElementById('idForm');
// const tableBody = document.querySelector("#productsTable tbody");

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     console.log('Form submitted');
//     const datForm = new FormData(e.target);
//     const user = Object.fromEntries(datForm);
//     console.log('usuario:', user);
//     e.target.reset();
// });

const logoutButton = document.querySelector('.logout-button');

logoutButton.addEventListener('click', async () => {
    try {
        // Realiza una solicitud GET al servidor para ejecutar la lógica de logout.
        const response = await fetch('/api/sessions/logout', {
            method: 'GET', // Utiliza el método GET para logout según tu ruta en session.routes.js
        });

        if (response.status === 200) {
            // Si la solicitud fue exitosa (status 200), redirige al usuario a la página de inicio de sesión.
            window.location.href = '/login';
        } else {
            // Maneja cualquier otro resultado de la solicitud aquí (por ejemplo, si hay errores).
            console.error('Error al realizar el logout:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar el logout:', error);
    }
});