// local data
let localWorks = null;

init();

async function init() {

    // Chargement de la galerie et des filtres
    await loadGallery();
    loadGalleryFilters();

    // Selectionne tous les filtres (<button>)
    document.querySelectorAll('.js-filter').forEach(b => {
        b.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            filterGallery(localWorks, id)
        });
    });

    // Mode edition si authentifie
    checkAuth();

}

function checkAuth() {

    // Recuperation du token
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth) {
        // Debug
        console.log(auth.token);

        // Creation des elements invisibles
        displayEditMode();

        // Selectionne tous les liens (<a>) senses ouvrir des boites modales
        document.querySelectorAll('.js-modal').forEach(a => {
            a.addEventListener('click', (event) => openModal(event));
        });

        // Cache le filtre
        const filters = document.querySelectorAll(".filters-button");
        for (filter of filters) {
            filter.hidden = true;
        }
        
        // Login devient logout
        const login = document.querySelector("nav ul li a");      
        login.innerText = "logout";
        login.addEventListener('click', () => {
            userLogout();
        });
    }
}

function displayEditMode() {

    // Récupération des éléments existants
    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const portfolio = document.getElementById("portfolio");
    const h2 = portfolio.querySelector("h2");
    const filters = document.getElementById("filters");

    // Suppression d'elements existants
    portfolio.removeChild(h2);

    // Creation des elements
    createEditBanner(body, header);
    createEditPortfolio(portfolio, filters);
    createRemoveModal(localWorks, portfolio);
    createAddModal(localWorks, portfolio);
}

function createEditBanner(parentElement, referenceElement) {

    // Creation des elements
    const editModeContainer = document.createElement("div");
    const editModeContent = document.createElement("div");
    const editModeInline = document.createElement("i");
    const editModeButton = document.createElement("button");

    // Ajout des selecteurs
    editModeContainer.id = "edit-mode";
    editModeInline.classList.add("fa-regular", "fa-pen-to-square");

    // Modification des proprietes
    editModeButton.innerText = "Mode édition";

    // Insertion des elements
    editModeContainer.appendChild(editModeContent);
    editModeContent.appendChild(editModeInline);
    editModeContent.appendChild(editModeButton);
    parentElement.insertBefore(editModeContainer, referenceElement);
}

function createEditPortfolio(parentElement, referenceElement) {

    // Creation des elements
    const portfolioTitleContainer = document.createElement("div");
    const portfolioTitleHeader = document.createElement("h2");
    const portfolioTitleContent = document.createElement("div");
    const portfolioTitleInline = document.createElement("i");
    const portfolioTitleAnchor = document.createElement("a");

    // Ajout des selecteurs
    portfolioTitleContainer.id = "edit-portfolio";
    portfolioTitleInline.classList.add("fa-regular", "fa-pen-to-square");
    portfolioTitleAnchor.classList.add("js-modal");

    // Modification des proprietes
    portfolioTitleHeader.innerText = "Mes Projets";
    portfolioTitleAnchor.href = "#modal-remove-photo";
    portfolioTitleAnchor.innerText = "modifier";

    // Insertion des elements
    portfolioTitleContent.appendChild(portfolioTitleInline);
    portfolioTitleContent.appendChild(portfolioTitleAnchor);
    portfolioTitleContainer.appendChild(portfolioTitleHeader);
    portfolioTitleContainer.appendChild(portfolioTitleContent);
    parentElement.insertBefore(portfolioTitleContainer, referenceElement);
}
