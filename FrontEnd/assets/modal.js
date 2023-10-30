let modal = null;
let workPhoto = null;
let workTitle = "";
let workCategory = "";

// === CONTROLLERS ===

function openModal(event) {

    // Desactive comportement par defaut
    event.preventDefault();

    // Si une autre modal est deja ouverte, la fermer
    if (modal) {
        closeModal();
    }

    // Recupere la modale
    const target = document.querySelector(event.target.getAttribute('href'));

    // Debug
    console.log(event.target);
    console.log(target);

    // Affiche la modale
    target.style.display = null;

    // Sauvegarde la cible
    modal = target;

    // La boite modale se ferme au click
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

}

function closeModal(event) {

    // Si la modale n'existe pas on ne va pas plus loin
    if (modal === null) return

    if (event) {
        // Desactive du comportement par defaut
        event.preventDefault();
    }

    // Remasque la modale
    modal.style.display = "none";

    // Supprime les listeners pour "nettoyer" la modale
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // Reinitialise modal
    modal = null;

}

function stopPropagation(event) {

    // Empeche la propagation de l'evenement vers les elements parents
    event.stopPropagation();
}

async function removeWork(id) {

    try {        
        // Supprime du serveur
        await deleteWork(id);

        // Supprime dans le tableau works
        updateWorks(id);

        // Supprime du DOM
        removeWorkElements(id);

    } catch (e) {
        console.error(e);
        throw e;
    }
}

function updateWorks(id) {

    // Mise a jour du tableau localWorks
    const updatedWorks = localWorks.filter(work => work.id !== id);
    localWorks = updatedWorks;

    // Debug
    console.log(localWorks);
}

function removeWorkElements(id) {

    // Recupere des éléments
    const figures = document.querySelectorAll(`.js-work[data-work-id='${id}']`);

    // Supprime du DOM
    for (figure of figures) {
        parentElement = figure.parentElement;
        parentElement.removeChild(figure);
        console.log(parentElement);
    }
}

function checkConditions() {

    // Debug
    console.log(workPhoto);
    console.log(workTitle);
    
    // Si photo non définie ou si titre vide
    if (workPhoto === null || workTitle === "" ) {

        // Desactive le bouton Valider
        document.getElementById('modal-add-button').classList.remove("active");
        document.getElementById('modal-add-button').classList.add("inactive");

        console.log("Veuillez remplir tous les champs !");
        
        return false;

    }

    // Si photo définie et titre non vide
    if (workPhoto != null && workTitle !== "") {

        // Active le bouton Valider
        document.getElementById('modal-add-button').classList.remove("inactive");
        document.getElementById('modal-add-button').classList.add("active");

        console.log("Tout est OK !");
        
        return true;

    }

}

async function addWork(title, category) {

    try {

        console.log(title);
        console.log(category);

        // Ajoute sur le serveur
        const r = await uploadWork(workPhoto, title, category);
        const data = await r.json();          

        // Ajoute dans le tableau localWorks
        localWorks.push(data);

        // Ajoute au DOM
        addWorkElements();

        // Ferme la modale
        closeModal();

    } catch (e) {
        throw e;
    }

}

function addWorkElements() {

    // Recupere le dernier element de localWorks
    const lastWork = localWorks[localWorks.length - 1];

    // Debug
    console.log(lastWork);

    // Recupere les conteneurs
    const modalRemove = document.getElementById('modal-remove');
    const gallery = document.querySelector(".gallery");

    // Ajoute les elements au DOM
    createModalWork(lastWork, modalRemove);
    createWork(lastWork, gallery);

}

// === BACKEND ===

async function deleteWork(id) {

    // Recupere le token dans le localStorage
    const auth = JSON.parse(localStorage.getItem("auth"));

    try {
        // Execute la requete HTTP
        const r = await fetch('http://localhost:5678/api/works/' + id, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + auth.token
            }
        });

        // Gere les erreurs HTTP
        if (!r.ok) {
            throw new Error(`HTTP error! Status: ${r.status}`);      
        }

        // Retourne la reponse
        return r;

    } catch (e) {
        // Gere les erreurs de la fonction fetch()
        console.error(e);
        throw e;
    }
}

async function uploadWork(imageFile, title, category) {

    // Recupere le token dans le localStorage
    const auth = JSON.parse(localStorage.getItem("auth"));

    // Creation de l'objet formData
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);
    formData.append('title', title);
    formData.append('category', category);
    
    // Debug
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    try {
        // Execute la requete HTTP
        const r = await fetch('http://localhost:5678/api/works/', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + auth.token
            },
            body: formData
        });

        // Gere les erreurs HTTP
        if (!r.ok) {
            throw new Error(`HTTP error! Status: ${r.status}`);      
        }

        // Retourne la reponse
        return r;

    } catch (e) {
        // Gere les erreurs de la fonction fetch()
        console.error(e);
        throw e;
    }

}

// === DOM ===

function createRemoveModal(works, parentElement) {

    // === MODAL ===

    const modal = document.createElement("aside");
    modal.id = "modal-remove-photo";
    modal.classList.add("modal");
    modal.style.display = "none"; // Par defaut la modale n'est pas visible

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modal-wrapper", "js-modal-stop");

    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-nav");

    const modalBack = document.createElement("a");
    modalBack.hidden = true;

    const modalBackIcon = document.createElement("i");
    modalBackIcon.classList.add("fa-solid", "fa-arrow-left", "modal-back");

    const modalClose = document.createElement("i");
    modalClose.classList.add("fa-solid", "fa-xmark", "modal-close", "js-modal-close");

    const modalTitle = document.createElement("h3");
    modalTitle.classList.add("modal-title");
    modalTitle.innerText = "Galerie Photo";

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalLine = document.createElement("div");
    modalLine.classList.add("modal-line");

    const modalButton = document.createElement("a");
    modalButton.id = "modal-button-add";
    modalButton.classList.add("modal-button", "active", "js-modal");
    modalButton.innerText = "Ajouter une photo";
    modalButton.href = "#modal-add-photo";
    modalButton.addEventListener('click', () => {

        resetAddModalContent();

    });

    // === CONTENT ===

    const modalRemove = document.createElement("div");
    modalRemove.id = "modal-remove";
    modalRemove.classList.add("modal-remove");

    works.forEach(work => {

        createModalWork(work, modalRemove);   

    });

    // === INSERT ===

    modalBack.append(modalBackIcon);
    modalNav.append(modalBack, modalClose);

    // modalNav.append(modalBackIcon, modalClose);
    modalContent.append(modalRemove);
    modalWrapper.append(modalNav, modalTitle, modalContent, modalLine, modalButton);
    modal.append(modalWrapper);
    parentElement.append(modal);

}

function createModalWork(work, parentElememnt) {

    const figure = document.createElement("figure");
    figure.classList.add("modal-remove__item", "js-work");
    figure.setAttribute('data-work-id', work.id);

    const img = document.createElement("img");
    img.classList.add("modal-remove_photo");
    img.src = work.imageUrl;

    const trash = document.createElement("i");
    trash.classList.add("modal-remove_trash", "fa-solid", "fa-trash-can");
    trash.addEventListener('click', () => {

        removeWork(work.id);

    });

    figure.append(img, trash);
    parentElememnt.append(figure);

}

function createAddModal(works, parentElement) {

    // === MODAL ===

    const modal = document.createElement("aside");
    modal.id = "modal-add-photo";
    modal.classList.add("modal");
    modal.style.display = "none"; // Par defaut la modale n'est pas visible

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modal-wrapper", "js-modal-stop");

    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-nav", "js-modal-stop");

    const modalBack = document.createElement("a");
    modalBack.classList.add("modal-link", "js-modal");
    modalBack.href = "#modal-remove-photo";

    const modalBackIcon = document.createElement("i");
    modalBackIcon.classList.add("fa-solid", "fa-arrow-left", "modal-back");

    const modalClose = document.createElement("i");
    modalClose.classList.add("fa-solid", "fa-xmark", "modal-close", "js-modal-close");

    const modalTitle = document.createElement("h3");
    modalTitle.classList.add("modal-title");
    modalTitle.innerText = "Ajout Photo";

    const modalContent = document.createElement("div");
    modalContent.id = "modal-content-add";
    modalContent.classList.add("modal-content");

    const modalLine = document.createElement("div");
    modalLine.classList.add("modal-line");

    // === CONTENT ===

    const modalButton = createAddModalContent(modalContent);

    // === INSERT ===

    modalBack.append(modalBackIcon);
    modalNav.append(modalBack, modalClose);
    modalWrapper.append(modalNav, modalTitle, modalContent, modalLine, modalButton);
    modal.append(modalWrapper);
    parentElement.append(modal);

}

function createAddModalContent(modalContent) {

    const form = document.createElement('form');
    form.classList.add("modal-add");
    form.setAttribute('method', 'POST');
    form.setAttribute('enctype', 'multipart/form-data');

    const photoContent = document.createElement('div');
    photoContent.id = "modal-add-photo-content";
    photoContent.className = 'modal-add__wrapper';

    const photoIcon = document.createElement('i');
    photoIcon.className = 'modal-add__icon fa-regular fa-image';

    const photoButtonLabel = document.createElement('label');
    photoButtonLabel.className = 'modal-add__button-label';
    photoButtonLabel.setAttribute('for', 'photo-upload');
    photoButtonLabel.textContent = '+ Ajouter photo';

    const photoInput = document.createElement('input');
    photoInput.id = 'photo-upload';
    photoInput.className = 'modal-add__upload';
    photoInput.setAttribute('type', 'file');
    photoInput.setAttribute('name', 'photo');
    photoInput.setAttribute('accept', 'image/*');
    photoInput.addEventListener('change', () => {

        // Recupere le fichier
        const files = photoInput.files;
        workPhoto = files[0];
        console.log(workPhoto);

        // Affiche la photo dans la modale
        displayPhoto();

        checkConditions();

    });

    const photoInfo = document.createElement('p');
    photoInfo.className = 'modal-add__info';
    photoInfo.textContent = 'jpg, png: 4mo max';

    const titleLabel = document.createElement('label');
    titleLabel.className = 'modal-add__title-label';
    titleLabel.setAttribute('for', 'modal-add-title-input');
    titleLabel.textContent = 'Titre';
    
    const titleInput = document.createElement('input');
    titleInput.id = 'modal-add-title-input';
    titleInput.className = 'modal-add__title-input';
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    titleInput.addEventListener('input', () => {

        // Recupere les donnees en entree
        workTitle = titleInput.value;
        console.log(workTitle);

        checkConditions();

    });

    const categoryLabel = document.createElement('label');
    categoryLabel.className = 'modal-add__category-label';
    categoryLabel.setAttribute('for', 'modal-add-category');
    categoryLabel.textContent = 'Catégorie';

    const categorySelect = document.createElement('select');
    categorySelect.id = "modal-add-category";
    categorySelect.className = 'modal-add__category-select';
    categorySelect.setAttribute('name', 'category');
    categorySelect.addEventListener('change', () => {

        // Recupere les donnees en entree
        workCategory = categorySelect.value;
        console.log(workCategory);

    });

    const option1 = document.createElement("option");
    option1.value = "1";
    option1.textContent = "Objets";

    const option2 = document.createElement("option");
    option2.value = "2";
    option2.textContent = "Appartements";

    const option3 = document.createElement("option");
    option3.value = "3";
    option3.textContent = "Hotels & restaurants";

    const modalButton = document.createElement("a");
    modalButton.id = "modal-add-button";
    modalButton.classList.add("modal-button", "inactive");
    modalButton.innerText = "Valider";
    modalButton.addEventListener('click', () => {

        // Verifie si le formulaire est correctement rempli
        let check = checkConditions();
        console.log(check);

        // Si formulaire ok alors appel de la fonction
        if (check) {
            addWork(workTitle, workCategory);
        }

    });

    photoContent.append(photoIcon, photoButtonLabel, photoInput, photoInfo);
    categorySelect.append(option1, option2, option3);
    form.append(photoContent, titleLabel, titleInput, categoryLabel);
    form.append(categorySelect);
    modalContent.append(form);

    return modalButton;
}

function resetAddModalContent() {

    // Reinitialise le contenu de la modale
    const modalContent = document.getElementById('modal-content-add');
    modalContent.innerHTML = "";

    // Reinitialise les variables
    workPhoto = null;
    workTitle = "";
    workCategory = "";

    // Desactive le bouton Valider
    document.getElementById('modal-add-button').classList.remove("active");
    document.getElementById('modal-add-button').classList.add("inactive");

    // Recree le contenu de la modale
    createAddModalContent(modalContent);
    
}

function displayPhoto() {

    const photoContent = document.getElementById("modal-add-photo-content");
    photoContent.innerHTML = "";

    const img = document.createElement("img");
    img.id = "modal-add-photo-image";
    img.src = URL.createObjectURL(workPhoto);
    img.classList.add('modal-add__image');

    console.log(img);

    photoContent.append(img);

}
