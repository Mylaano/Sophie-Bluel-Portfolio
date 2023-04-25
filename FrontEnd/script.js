async function initWorks(){
    const resultFetch = await fetch('http://localhost:5678/api/works')
    const data = await resultFetch.json();

    for (const el of data) {
        const work = 
        `<figure data-category="${el.categoryId}">
            <img src="${el.imageUrl}" alt="${el.title}">
            <figcaption>${el.title}</figcaption>
        </figure>`;

        document.querySelector('.gallery').insertAdjacentHTML('beforeend', work);
    }
}
initWorks();

function showWorks(category) {
    for (const figure of document.querySelector('.gallery').getElementsByTagName("figure")) {
        figure.style.display = category == figure.dataset.category || category == 0 ? "block" : "none";
    }
}

async function showCategories() {
    const resultFetch = await fetch('http://localhost:5678/api/categories')
    const data = await resultFetch.json();

    for (const el of data) {
        const liBtn = 
        `<li>
            <button class="btn" data-category="${el.id}">${el.name}</button>
        </li>`;

        document.querySelector('.btn-list').insertAdjacentHTML('beforeend', liBtn);
    }

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(item => {
        item.addEventListener('click', e => {
            
            for (const btn of buttons) {
                btn.classList.remove('btn-active');
            }

            e.target.classList.toggle("btn-active");
            showWorks(e.target.dataset.category);
        })
    })
}

showCategories();

function showPhotoGallery() {
    document.querySelector('.modal-title').innerHTML = 'Galerie photo';

    // Hide figures
    const modalContent = document.querySelector('.modal-content');
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    // Show figures
    const galleryContainer = document.querySelector('.gallery');
    for(let i = 1; i < galleryContainer.childNodes.length; i++) {
        const content = 
        `<figure>
            <img src="${galleryContainer.childNodes[i].childNodes[1].src}" alt="Photo d'une réalisation">
            <figcaption>éditer</figcaption>
        </figure>`;

        document.querySelector('.modal-content').insertAdjacentHTML('beforeend', content);
    }

    document.querySelector('.modal-bottom-btn').childNodes[1].innerHTML = 'Ajouter une photo';
}

const token = sessionStorage.getItem('token');
if(token !== null) {
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

    // Close the modal
    document.querySelector('.modal-close').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modal-container').style.display = 'none';
    })
}
