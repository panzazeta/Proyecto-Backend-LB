const logoutButton = document.querySelector('.logout-button');

logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'GET',
        });

        if (response.status === 200) {
            window.location.href = '/login';
        } else {
           console.error('Error al realizar el logout:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar el logout:', error);
    }
});

