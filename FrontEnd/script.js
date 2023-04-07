async function showWorks(category = 'null') {
    const resultFetch = await fetch('http://localhost:5678/api/works')
    const data = await resultFetch.json();

    const galleryContenair = document.querySelector('.gallery');

    for (let i = 0; i < data.length; i++) {
        if(category !== data[i].categoryId && category !== 'null') continue;
        
        const figure = galleryContenair.appendChild(document.createElement('figure'));

        const image = figure.appendChild(document.createElement('img'));
        image.src = data[i].imageUrl;

        const figcaption = figure.appendChild(document.createElement('figcaption'));
        figcaption.innerHTML = data[i].title;
    }
}

function hideWorks() {
    const galleryContenair = document.querySelector('.gallery');
    while(galleryContenair.firstChild) {
        galleryContenair.removeChild(galleryContenair.firstChild);
    }
}

async function showCategories() {
    const resultFetch = await fetch('http://localhost:5678/api/categories')
    const data = await resultFetch.json();

    const btnList = document.querySelector('.btn-list');

    for (let i = 0; i < data.length; i++) {
        const li = btnList.appendChild(document.createElement('li'));
        const btn = li.appendChild(document.createElement('button'));

        btn.classList.add('btn');
        btn.innerHTML = data[i].name;

        switch(data[i].id) {
            case 1:
                btn.setAttribute('data-category', 'objects');
                break;
            case 2:
                btn.setAttribute('data-category', 'appartments');
                break;
            case 3:
                btn.setAttribute('data-category', 'hotels and restaurants');
                break;
        }
    }

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(item => {
        item.addEventListener('click', e => {
            
            for(let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('btn-active');
            }

            hideWorks();
            
            switch(e.target.dataset.category) {
                case "all":
                    buttons[0].classList.toggle("btn-active");
                    showWorks();
                    break;
                case "objects":
                    buttons[1].classList.toggle("btn-active");
                    showWorks(1);
                    break;
                case "appartments":
                    buttons[2].classList.toggle("btn-active");
                    showWorks(2);
                    break;
                case "hotels and restaurants":
                    buttons[3].classList.toggle("btn-active");
                    showWorks(3);
                    break;
            }

        })
    })
}

showWorks();
showCategories();