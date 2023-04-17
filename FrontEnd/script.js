async function initWorks(){
    const resultFetch = await fetch('http://localhost:5678/api/works')
    const data = await resultFetch.json();

    const galleryContainer = document.querySelector('.gallery');

    for (const el of data) {
        const work = 
        `<figure data-category="${el.categoryId}">
            <img src="${el.imageUrl}" alt="${el.title}">
            <figcaption>${el.title}</figcaption>
        </figure>`

        galleryContainer.insertAdjacentHTML('beforeend', work)
    }
}
initWorks();

function showWorks(category) {
    const figure = document.querySelectorAll('figure');
   
    figure.forEach(el => {
        el.style.display = category == el.dataset.category || category == 0 ? "block" : "none";
    })
}

async function showCategories() {
    const resultFetch = await fetch('http://localhost:5678/api/categories')
    const data = await resultFetch.json();

    const btnList = document.querySelector('.btn-list');

    for (const el of data) {
        const liBtn = 
        `<li>
            <button class="btn" data-category="${el.id}">${el.name}</button>
        </li>`

        btnList.insertAdjacentHTML('beforeend', liBtn)
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

const token = sessionStorage.getItem('token');
if(token) {
    
}