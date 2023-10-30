// === CONTROLLERS ===

function loadGalleryFilters() {

    // Initialise un tableau pour stocker les objets de catégorie unique
    let categoriesArray = [];

    // Ajoute la categorie "Tous" au tableau
    categoriesArray.push({id: 0, name: "Tous"});

    // Insere les categories dans le tableau
    localWorks.forEach(work => {
        const category = work.category;
        if (!categoriesArray.find((categoryAlreadyInserted) => categoryAlreadyInserted.id === category.id)) {
            categoriesArray.push({id: category.id, name: category.name});
        }
    })

    // Debug
    console.log(categoriesArray);

    // Affiche les filtres
    displayGalleryFilters(categoriesArray);

}

function filterGallery(data, id) {

    // Creation d'un nouveau tableau
    let dataFiltered = [];

    if (id === 0) {
        // La categorie "Tous" ne filtre pas les donnees
        dataFiltered = data;
    } else {
        dataFiltered = data.filter(el => el.categoryId === id);
    }

    console.log(dataFiltered);

    // Mise a jour de la categorie active
    displayActiveFilter(id);

    // Mise à jour de la galerie
    displayGallery(dataFiltered);

}

// === DOM ===

function displayGalleryFilters(categories) {

    // Recuperation des elements
    const portfolio = document.getElementById("portfolio");
    const gallery = document.querySelector(".gallery");

    // Creation du conteneur html
    const filters = document.createElement("div");
    filters.id = "filters";
    filters.classList.add("filters");
    portfolio.insertBefore(filters, gallery);

    // Creation des boutons html du conteneur
    categories.forEach(category => {
        createFilter(category);        
    });

}

function createFilter(category) {

    // Creation du bouton
    const filter = document.createElement("button");
    filter.classList.add("filters-button", "js-filter");
    filter.innerText = category.name;

    // Ajoute un attribut a chaque bouton
    filter.setAttribute('data-id', category.id);

    // Par defaut "Tous" est selectionne
    if (category.id === 0) {filter.classList.add('selected')};

    // Ajoute le bouton au conteneur
    filters.appendChild(filter);

}

function displayActiveFilter(id) {

    // Supression de la classe "selected" de tous les boutons
    document.querySelectorAll('.js-filter').forEach((button) => {
        button.classList.remove('selected');
    });

    // Ajoute la classe "selected" au bouton cliqué
    document.querySelector(`.js-filter[data-id="${id}"]`).classList.add('selected');

}
