'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM Query Selectors
const getModal = document.querySelector('.modal');

const getHeader = document.querySelector('.header');
const getHeaderContent = document.querySelector('.header__content')
const getHeaderContainer = document.querySelector('.header__container')

const getMonsterInput = document.querySelector('.header__options--input');
const getMonsterSelection = document.querySelector('.header__options--select');
const getMonsterButton = document.querySelector('.header__options--button');

const getMonsterSection = document.querySelector('.section-monster');
const getLocaleSection = document.querySelector('.section-locales')
const getFooter = document.querySelector('.footer')

const getSpinner = document.querySelector('.spinner')
const getMessageContainer = document.querySelector('.message')


const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


const getJSON = async function(url) {
    try {
        const res = await Promise.race([fetch(url), timeout(10)]);
        const data = await res.json();
    
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch(err) {
        throw err;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modal *refactor this

const renderSpinner = function() {
    getModal.style.display = 'block';
    getModal.classList.add('spinner')
    getMonsterInput.disabled = true;
};

const removeSpinner = function() {
    getModal.style.display = 'none';
    getModal.classList.remove('spinner')
    getMonsterInput.disabled = false;
};

const renderModal = function() {
    getModal.style.display = 'block';
    getModal.innerHTML = '';
    getMonsterInput.disabled = true;
}

const clearModal = function() {
    getModal.style.display = 'none';
    getModal.innerHTML = '';
    getMonsterInput.disabled = false;
}



const diplayImageModal = function(img) {
    const html = `
        <div class="modal__content">
            <div class="modal__toggle">
                <i class="modal__toggle--icon" aria-hidden="true">&#10006;</i>
            </div>
            <img class="modal__img" src="${img}" id="modal-img">
        </div>

    `;
    getModal.innerHTML = '';
    getModal.insertAdjacentHTML('beforeend', html)
    getModal.style.display = 'block';

    document.querySelector('.modal__toggle--icon').addEventListener('click', function() {
        getModal.style.display = 'none';
        document.querySelector('.modal__content').innerHTML = '';
  
    })
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render's Error Message

const renderError = function(message) {
    console.log(message)
    const html = `
    <div class="modal__error">
        <p>${message}</p>
        <button class="modal__button">Understood</button>
    </div>
    `;
    getModal.insertAdjacentHTML('beforeend', html)

    document.querySelector('.modal__button').addEventListener('click', () => {
        clearModal();
        removeSpinner();
    })
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Monster Search

let monsterName, monsterObj;
const loadSearchMonster = async function(query) {
    try {
        const data = await getJSON(`./monsters.json`)
        data.map(monster => {

            // Checks if Monster Name matches Search Query
            if (monster.name === query) { 
                monsterObj = monster;       // Contains Monster Object
                monsterName = monster.name; // Contains Monster Name
                return monsterName;
            }
        });
    } catch(err) {
        console.log(`${err} ${query}`)
        throw err;
    }
};



const controlSearchMonsters = async function() {
    try {
        renderSpinner();

        // 1. Gets Search Query
        const query = getMonsterInput.value.toLowerCase();

        // Displays an error here query is empty
        if (!query) return renderError('Please enter a monster name.');

        // 2. Loads Search Results
        await loadSearchMonster(query);

        // Throws an error if query doesn't match monsterName in loadSearchMonster()
        if (monsterName !== query) return renderError('Monster does not exist. Please try again.');
        
        // 3. Renders Results
        renderMonster(monsterObj)

    } catch (err) {
         console.log(`Search error: ${err}`)
    }
};




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Random Monster

const loadRandomMonster = async function() {
    try {
        renderSpinner();
        
        // 1. Get's Random Monster
        const data = await getJSON(`./monsters.json`)
        let randomizer = Math.floor(Math.random() * data.length);
    
        getMonsterSelection.value = data[randomizer].name;
        getMonsterInput.value = '';

        // 2. Render's Random Monster
        renderMonster(data[randomizer])

    } catch (err) {
        console.log(`Error: ${err}`)
    }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Monster Select

const displayMonsterSelection = async function() {
    try {
        const data = await getJSON(`./monsters.json`)
        data.map(monster => 
            getMonsterSelection.insertAdjacentHTML('beforeend', `<option class="selection__options" id="selections">${monster.name}</option>`))

    } catch (err) {
        console.log(err)
    }
}
displayMonsterSelection();


const loadSelectedMonster = async function(monster) {
    renderSpinner();
    const data = await getJSON(`./monsters.json`)
    getMonsterInput.value = '';
    
    // Loops Data & Checks if Monster Name matches Selected Monster and Displays Monster
    data.map(monData => {
        if (monData.name === monster) return renderMonster(monData);
    });
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Renders Monster & Locale

const renderMonster = function(monster) {

    // Removes Spinner & Previous Results
    removeSpinner();
    getMonsterSection.innerHTML = '';

    // Creates Div Then Contains Monster Info
    const html = `
    <!-- Monster Header -->
    <div class="monster">
        <div class="heading-1">
            <img src="${monster.icon}" class="heading-1--icon">
            <h2 class="secondary--heading">
                <span class="secondary-heading--main">${monster.name}</span>
                <span class="secondary-heading--sub">${monster.species}</span>
            </h2>
        </div>
        <div class="monster__container">
            <div class="monster__render">
                <img src="${monster.render}" class="monster__render--img">
            </div>
            <div class="monster__info">
                <p class="monster__desc">
                    <span class="monster__desc--subject">Ecology: </span>${monster.description}
                </p>
                <p class="monster__desc">
                    <span class="monster__desc--subject">Useful Information: </span>${monster.useful_info}
                </p>
                <p class="monster__desc">
                    <span class="monster__desc--subject">Elements: </span>
                    ${monster.elements == '' ? 'None' : monster.elements.map(createMonsterElements).join(', ')}
                </p>
                <p class="monster__desc">
                    <span class="monster__desc--subject">Ailments: </span>
                    ${monster.ailments == '' ? 'None' : monster.ailments.map(createMonsterElements).join(', ')}
                </p>
                <div class="monster__grid-attributes">
                    <div>
                        <p class="monster__desc--subject">Weakness: </p>
                        <ul class="monster__list">
                            ${monster.weaknesses == '' ? 'None' : monster.weaknesses.map(createMonsterWeakness).join('')}
                        </ul>
                    </div>
                    <div>
                        <p class="monster__desc--subject">Resistances: </p>
                        <ul class="monster__list">
                            ${monster.resistances == '' ? 'None' : monster.resistances.map(createMonsterWeakness).join('')}
                        </ul>
                    </div>
                </div>
                <div class="monster__legend">
                    <p>⭐️⭐️⭐️= Weak</p>
                    <p>⭐️⭐️= Vulnerable</p>    
                    <p>⭐️= Resistant</p>
                    <p>❌= Immune</p>
                </div>
            </div>
        </div>
    </div>
    `;
    getMonsterSection.insertAdjacentHTML('beforeend', html);


    // Displays / Enables Elements
    getMonsterSection.style.display = "block";
    getFooter.style.display = 'block';
    getMonsterInput.disabled = false;

    // Render's Locales
    renderLocale(monster.locations)


    // Scrolls to Monster
    $('html, body').animate({scrollTop: $('.section-monster').offset().top}, 300);


    // Enlarges Monster Images
    const monsterImage = document.querySelector('.monster__render--img');
    const monsterImageSrc = document.querySelector('.monster__render--img').getAttribute('src');

    monsterImage.addEventListener('click', function() {
        diplayImageModal(monsterImageSrc);        
    })
}


// Returns Monster Element/Ailment
const createMonsterElements = monsterElements => `${monsterElements.charAt(0).toUpperCase() + monsterElements.slice(1)}`;

const createMonsterWeakness = monsterElements => {
    const monEffectiveness = monsterElements.stars > 0 ? '⭐️'.repeat(monsterElements.stars) : '❌'.repeat(monsterElements.stars + 1);
    const monCondition = !monsterElements.condition ? '' : `(${monsterElements.condition})`;

    return `<li>${monsterElements.element} ${monEffectiveness} ${monCondition}</li>`
}


const renderLocale = function(monster) {
    const html = `
    <div class="locales">
        <div class="heading-2">
            <img src="img/locale/map_icon.png" class="heading-2--icon">
            <h2 class="secondary--heading">
                <span class="secondary-heading--main">Locales</span>
                <span class="secondary-heading--sub">The New World</span>
            </h2> 
        </div>
        <div class="locales__grid">
            ${monster.map(locale => {
                return `
                <div class="locales__container">
                    <img src="${locale.img}" class="locales__img">
                    <p class="locales__name">${locale.name}</p>
                </div>
                `
            }).join('')}
        </div>
    </div>
    `
    getLocaleSection.style.display = "block";
    getLocaleSection.innerHTML = '';
    getLocaleSection.insertAdjacentHTML('beforeend', html);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Randomizes Background Images

const randomBackgroundImage = function() {
    const randombackground = Math.round(Math.random() * 7);
    const backgroundImages = [
        "url(img/locale/ancient-forest.jpg)",
        "url(img/locale/wildspire-waste.jpg)",
        "url(img/locale/rotten-vale.jpg)",
        "url(img/locale/coral-highlands.jpg)",
        "url(img/locale/elders-recess.jpg)",
        "url(img/locale/hoarfrost-reach.jpg)",
        "url(img/locale/guiding-lands.jpg)",
        "url(img/locale/castle-schrade.jpg)"
    ];
    getHeader.style.backgroundImage = backgroundImages[randombackground];
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Event Listeners / Random Background Image / Displays Options of Monster

const init = function() {
    getMonsterInput.addEventListener('keypress', e => {
        if (e.keycode === 3 || e.which === 13) controlSearchMonsters()
    })

    getMonsterButton.addEventListener('click', loadRandomMonster);
    getMonsterSelection.addEventListener('change', () => loadSelectedMonster(getMonsterSelection.value));

    randomBackgroundImage();
    displayMonsterSelection();
}
init()