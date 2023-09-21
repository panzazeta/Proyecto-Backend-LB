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

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('idForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 200) {
                window.location.href = '/products';
            } else {
                const responseData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el inicio de sesión',
                    text: responseData.resultado || 'Ha ocurrido un error en el inicio de sesión.'
                });
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    });
});