const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let email

Swal.fire({
    title: "Identificacion de usuario",
    text: "Por favor, ingrese su email",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "Ingrese un nombre de usuario válido"
    },
    allowOutsideClick: false
}).then(resultado => {
    email = resultado.value
    console.log(email)
    socket.emit('display-inicial')
})

botonChat.addEventListener('click', () => {
    if (valInput.value.trim().length > 0) {
        socket.emit('add-message', {email: email, mensaje: valInput.value })
        console.log(valInput);
        valInput.value = ""
       
    }
});

socket.on('add-message', (arrayMensajes) => {
    parrafosMensajes.innerHTML = ""
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p>${mensaje.fecha}: el usuario ${mensaje.user} escribió: ${mensaje.mensaje} </p>`
    })
})