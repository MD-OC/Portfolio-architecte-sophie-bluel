init();

async function init() {

    // Selectionne tous les formulaires (<form>) permettant l'authentification
    document.querySelectorAll('.js-login-form').forEach(f => {
        f.addEventListener('submit', (e) => userLogin(e));
    });
}

// === CONTROLLERS ===

async function userLogin(event) {

    // Desactivation du comportement par defaut
    event.preventDefault();

    // Recupere les valeurs des deux champs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Recuperation des donnees utilisateur 
        const data = await gethUser(email, password);

        console.log(data);

        // Stockage des donnees utilisateur dans le localStorage
        window.localStorage.setItem("auth", JSON.stringify(data));

        // Redirection vers la home
        window.location.href = '/index.html';

    } catch (e) {
        displayErrorMessage("Erreur dans l'identifiant ou le mot de passe");
        throw e;
    }

}

function userLogout() {

    // Suppression des donnees utilisateur dans le localStorage
    window.localStorage.removeItem("auth");
}

// === BACKEND ===

async function gethUser(email, password) {

    try {
        // Execution de la requete HTTP
        const r = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Gestion des erreurs HTTP
        if (!r.ok) {
            throw new Error(`HTTP error! Status: ${r.status}`);      
        }

        // Retourne la reponse
        return r.json();

    } catch (e) {
        // Gestion des erreurs de la fonction fetch()
        console.error(e);
        throw e;
    }
}

// === DOM ===

function displayErrorMessage(message) {

    // Recuperation des elements
    const flashMessage = document.getElementById("flash-message");

    // Modification des proprietes
    flashMessage.innerText = message;
    flashMessage.style.display = null; // Affiche le message
}
