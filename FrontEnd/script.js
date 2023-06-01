// Functions

function showWork(el) {

    // Add this work on the section "Mes projets"
    const work = 
        `<figure data-category="${el.categoryId}" data-id="${el.id}">
            <img src="${el.imageUrl}" alt="${el.title}">
            <figcaption>${el.title}</figcaption>
        </figure>`;
    
    document.querySelector('.gallery').insertAdjacentHTML('beforeend', work);

    // Add this work on the modal
    const content = 
        `<figure data-id="${el.id}">
            <img src="${el.imageUrl}" alt="${el.title}">
            <figcaption>éditer</figcaption>
            <button class="btn-del-icon" data-id="${el.id}">
                <img src="assets/icons/bin-icon.svg" alt="Icône d'une corbeille">
            </button>
        </figure>`;

    document.querySelector('.modal-gallery').insertAdjacentHTML('beforeend', content);
}

async function initWorks() {
    try {
        const resultFetch = await fetch('http://localhost:5678/api/works');
        const data = await resultFetch.json();

        for (const el of data) {
            showWork(el);
        }

        // Delete the work
        if(sessionStorage.getItem('token') !== null) {
            // Deleting a work by clicking on the trash button
            document.querySelectorAll('.btn-del-icon').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();

                    deleteWork(e.target.dataset.id);
                })
            })
        }
    }
    catch(error) {
        alert("Une erreur est survenue lors de l'initialisation des travaux.");
        console.log(error);
    }
}

async function addWork() {
    try {
        const picture = document.querySelector('.img-addwork').files[0];
        const title = document.querySelector('.title-addwork');
        const category = document.querySelector('.categories-addwork');
        
        if(picture.name <= 0 || (!['image/jpeg', 'image/png', 'image/jpg'].includes(picture.type))) {
            return alert("L'image n'est pas sélectionné ou son format est incorrect.");
        }
        if(title.value.length <= 0) {
            return alert("Veuillez entrer un titre.");
        }
        if(category.value.length <= 0) {
            return alert("Veuillez sélectionner une catégorie.");
        }

        const formData = new FormData(document.getElementById('addwork-form'));
        
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: formData
        })
        if(response.ok) {
            showPhotoGallery();

            const data = await response.json();
            showWork(data)
        }
        else {
            console.log("Erreur lors de la création du projet.");
        }
    }
    catch(error) {
        alert("Une erreur est survenue lors de l'ajout d'un nouveau projet.");
        console.log(error);
    }
}

async function deleteWork(id) {
    try {
        const resultFetch = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        if(resultFetch.ok) {
            // Delete the figure from the gallery and delete the figure from the modal
            document.querySelectorAll(`figure[data-id="${id}"]`).forEach(item => {
                item.parentNode.removeChild(item);
            })
        }
    } catch (error) {
        alert("Une erreur est survenue lors de la suppression.");
        console.log(error);
    }
}

function filterWorks(category) {
    for (const figure of document.querySelector('.gallery').getElementsByTagName("figure")) {
        figure.style.display = category == figure.dataset.category || category == 0 ? "block" : "none";
    }
}

async function showCategories() {
    try {
        const resultFetch = await fetch('http://localhost:5678/api/categories');
        const data = await resultFetch.json();

        for (const el of data) {
            // Add the categories to the filter bar
            const liBtn = 
            `<li>
                <button class="btn" data-category="${el.id}">${el.name}</button>
            </li>`;

            document.querySelector('.btn-list').insertAdjacentHTML('beforeend', liBtn);

            // Add the categories to the select on the modal
            document.querySelector('.categories-addwork').insertAdjacentHTML('beforeend', `<option value="${el.id}">${el.name}</option>`);
        }

        // Filter works
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(item => {
            item.addEventListener('click', (e) => {
                for (const btn of buttons) {
                    btn.classList.remove('btn-active');
                }
            
                e.target.classList.toggle("btn-active");
                filterWorks(e.target.dataset.category);
            })
        })
    } catch (e) {
        console.log(e);
        alert("Une erreur est survenue lors de la récupération des catégories.");
    }
}

function showPhotoGallery() {
    // Hide back arrow
    document.querySelector('.modal-comeback').style.visibility = 'hidden';

    // Update the title of the modal
    document.querySelector('.modal-title').innerHTML = 'Galerie photo';

    // Hide the add work form in the modal
    document.querySelector('.modal-addwork').style.display = 'none';

    // Show the gallery in the modal
    document.querySelector('.modal-gallery').style.display = 'grid';

    // Show the modal bottom button
    document.querySelector('.modal-bottom-btn').style.display = 'flex';

    // Show button delete work
    document.querySelector('.btn-deletework').style.display = 'block';
}

// Call the functions
initWorks();
showCategories();

// Only if the user is logged
if(sessionStorage.getItem('token') !== null) {
    // Show Edit Mode on top page
    document.querySelector('.editmode').style.display = 'flex';

    // Change button login text by "logout"
    const linkLoginBtn = document.querySelector('.link-login');
    linkLoginBtn.innerHTML = "logout";
    linkLoginBtn.href = '#';
    
    // Logout user
    linkLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        window.location = "index.html";
    })

    // Hide filters
    document.querySelector('.filter').style.display = 'none';

    // Show buttons if user is logged
    const editBtn = document.querySelectorAll('.edit-btn');
    editBtn.forEach(item => {
        item.style.display = 'inline-flex';
    })

    // Show the modal
    editBtn.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.modal-container').style.display = 'flex';

            showPhotoGallery();
        })
    })

    // Show modal add work
    document.querySelector('.btn-addwork').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show back arrow
        document.querySelector('.modal-comeback').style.visibility = 'visible';

        // Update the title of the modal
        document.querySelector('.modal-title').innerHTML = 'Ajout photo';

        // Hide the gallery in the modal
        document.querySelector('.modal-gallery').style.display = 'none';

        // Show the add work form in the modal
        document.querySelector('.modal-addwork').style.display = 'block';

        // Hide the modal bottom button
        document.querySelector('.modal-bottom-btn').style.display = 'none';

        // Hide the upload work img
        document.querySelector('.upload-work-img').style.display = 'none';

        // Show the upload work form
        document.querySelector('.upload-work-form').style.display = 'flex';

        // Change background submit input to grey
        document.querySelector('.btn-submit-work').style.backgroundColor = 'rgb(167, 167, 167)';

        // Reset the title input
        document.querySelector('.title-addwork').value = '';

        // Reset image input element
        document.querySelector('.img-addwork').value = '';

        // Reset the select element
        document.querySelector('.categories-addwork').selectedIndex = 0;
    })

    // Show modal gallery
    document.querySelector('.modal-comeback').addEventListener('click', (e) => {
        e.preventDefault();
        showPhotoGallery();
    })

    // Closing the modal by clicking on the cross
    document.querySelector('.modal-close').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modal-container').style.display = 'none';
    })

    // Closing the modal by clicking outside it
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.addEventListener('click', (e) => {
        if(e.target.classList.value == "modal-container")
            modalContainer.style.display = 'none';
    })

    // Listen input files for the upload work
    const uploadWorkForm = document.querySelector('.upload-work-form');
    uploadWorkForm.addEventListener('change', (e) => {
        // Hide the upload work form
        uploadWorkForm.style.display = 'none';

        const uploadWorkImg = document.querySelector('.upload-work-img');
        // Show the upload work img
        uploadWorkImg.style.display = 'flex';

       // Empty html
       uploadWorkImg.innerHTML = '';

        // Add the current image file
        uploadWorkImg.insertAdjacentHTML('beforeend', 
            `<img src="${URL.createObjectURL(e.target.files[0])}" 
            alt="${e.target.files[0].name}" 
            class="current-img-upload">`
        );
    })

    // Check if the inputs is empty or not for change the submit button into green
    document.getElementById('addwork-form').addEventListener('input', () => {
        document.querySelector('.btn-submit-work').style.backgroundColor = document.querySelector('.title-addwork').value.length > 0 && document.querySelector('.img-addwork').value.length > 0 ? '' : 'rgb(167, 167, 167)';
    });

    // Submit the work
    document.getElementById('addwork-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addWork();
    })
}