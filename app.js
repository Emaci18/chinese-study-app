function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.id) el.id = options.id;
    if (options.text) el.textContent = options.text;
    return el;
}
let cardDeck = [];
let currentCardIndex = 0;
let showDefinition = false;
// Containers


async function initializeDeck() {
    try {
        const response = await fetch('output.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return data

    } catch (error) {
        console.error("Error loading cards:", error);
    }
}


/////////////////////////////////////// All used to create the page ///////////////////////////////////////

const pageContainer = createElement('div', { className: "page_container", id: "pageContainer" });
const wordCounterContainer = createElement('div', { className: "word_counter_container", id: "wordCounterContainer" })
const wordCounter = createElement('div', { className: "word_counter", id: "wordCounter" })



const studyUnitContainer = createElement('div', { className: "study_unit_container", id: "studyUnitContainer" });
const cardContainer = createElement('div', { className: "card_container", id: "cardContainer" });
const characterContainer = createElement('div', { className: "character_container", id: "characterContainer" });

const character = createElement('div', { className: "character", id: "characterSelection", text: "里" });
const pinyin = createElement('div', { className: "pinyin", id: "pinyin_", text: "rén" });
const definitionContainer = createElement('div', { className: "definition_container", id: "translationContainer" });
const translation = createElement('p', { className: "definition", id: "translation", text: "Time flies so fast." });

const flipButtonContainer = createElement('div', { className: "flip_button_container", id: "flipButtonContainer" });
const flipButton = createElement('button', { className: "flip_button", id: "flipButton", text: "Flip" });

// Navigation
const arrowContainer = createElement('div', { className: "arrow_container", id: "arrowContainer" });
const cardNavigationButtonContainerBack = createElement('div', { className: "card_navigation_button_container", id: "cardNavigationBackBtnContainer" });
const cardNavigationBack = createElement('button', { className: "card_navigation_btn", id: "cardNavigationBack", text: "←" });

const cardNavigationButtonContainerShuffle = createElement('div', { className: "card_navigation_button_container", id: "cardNavigationShuffleBtnContainer" });
const cardNavigationShuffle = createElement('button', { className: "card_navigation_btn", id: "cardNavigationShuffle", text: "⇄" });

const cardNavigationNextBtnContainer = createElement('div', { className: "card_navigation_button_container", id: "cardNavigationNextBtnContainer" });
const cardNavigationNext = createElement('button', { className: "card_navigation_btn", id: "cardNavigationNext", text: "→" });

const restartDeckContainer = createElement('div', {
    className: "restart_deck_container"
});
const cardNavigationButtonContainerRestart = createElement('div', {
    className: "card_navigation_button_container_restart",
    id: "cardNavigationRestartBtnContainer"
});
const cardNavigationRestart = createElement('button', {
    className: "card_navigation_btn",
    id: "cardNavigationRestart",
    text: "Restart"
});

/////////////////////////////////////// All used to create the page ///////////////////////////////////////



function createStudyCard(parent, showDefinition) {
    const card = cardDeck[currentCardIndex];
    if (!card) return;

    characterContainer.innerHTML = "";
    wordCounter.textContent = `${currentCardIndex + 1}/${cardDeck.length}`;
    

    if (showDefinition) {
        const clonedPinyin = pinyin.cloneNode(true);
        clonedPinyin.textContent = card.pinyin;
        characterContainer.appendChild(clonedPinyin);

        const clonedDefinitionContainer = definitionContainer.cloneNode(false);
        const clonedTranslation = translation.cloneNode(true);
        clonedTranslation.textContent = card.translation;
        clonedDefinitionContainer.appendChild(clonedTranslation);
        characterContainer.appendChild(clonedDefinitionContainer);
    } else {
        const clonedCharacter = character.cloneNode(true);
        clonedCharacter.textContent = card.charecter;
        characterContainer.appendChild(clonedCharacter);
    }
    

    const clonedFlipContainer = flipButtonContainer.cloneNode(false);
    const clonedFlipButton = flipButton.cloneNode(true);
    clonedFlipButton.textContent = "Flip";

    clonedFlipButton.addEventListener("click", () => {
        showDefinition = !showDefinition;
        createStudyCard(studyUnitContainer, showDefinition);
    });

    clonedFlipContainer.appendChild(clonedFlipButton);
    characterContainer.appendChild(clonedFlipContainer);

    cardContainer.innerHTML = "";
    cardContainer.appendChild(characterContainer);

    if (!cardContainer.parentElement) {
        parent.appendChild(cardContainer);
    }
}

function createNavigationBlock(parent) {
    parent.appendChild(arrowContainer);
    cardNavigationButtonContainerBack.appendChild(cardNavigationBack);
    cardNavigationButtonContainerShuffle.appendChild(cardNavigationShuffle);
    cardNavigationNextBtnContainer.appendChild(cardNavigationNext);

    arrowContainer.appendChild(cardNavigationButtonContainerBack);
    arrowContainer.appendChild(cardNavigationButtonContainerShuffle);
    arrowContainer.appendChild(cardNavigationNextBtnContainer);
    cardNavigationButtonContainerRestart.appendChild(cardNavigationRestart);
    restartDeckContainer.appendChild(cardNavigationButtonContainerRestart);
    arrowContainer.parentElement.appendChild(restartDeckContainer);
    cardNavigationBack.addEventListener("click", () => {
        // Only go back if we're not at the first card
        if (currentCardIndex > 0) {
            currentCardIndex--;
        }
        showDefinition = false;
        createStudyCard(studyUnitContainer, showDefinition);
    });

    cardNavigationShuffle.addEventListener("click", () => {
        // Shuffle the cardDeck array using Fisher-Yates shuffle algorithm
        for (let i = cardDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]]; // Swap elements
        }
    

        currentCardIndex = 0; 
        showDefinition = false;
        createStudyCard(studyUnitContainer, showDefinition);
    });
    

    cardNavigationNext.addEventListener("click", () => {
        currentCardIndex = (currentCardIndex + 1) % cardDeck.length;
        showDefinition = false;
        createStudyCard(studyUnitContainer, showDefinition);
    });
    cardNavigationRestart.addEventListener("click", () => {
        currentCardIndex = 0;
        showDefinition = false;
        createStudyCard(studyUnitContainer, showDefinition);
    });
}



function renderCards(){
    document.body.appendChild(pageContainer);
    pageContainer.appendChild(studyUnitContainer);
    wordCounterContainer.appendChild(wordCounter);
    pageContainer.appendChild(wordCounterContainer);
    
    createStudyCard(studyUnitContainer, showDefinition);
    createNavigationBlock(studyUnitContainer);

}


function sayHello(){
    console.log("Hello")
}

async function main() {
    cardDeck = await initializeDeck();
    if (!cardDeck) return; 
    
    if (window.location.pathname === "/range2.html") {
        const fullPath = window.location.href;
        console.log(fullPath);

        const url = new URL(fullPath);
        const params = new URLSearchParams(url.search);
        console.log(params)

        const start = parseInt(params.get('start'), 10);  
        const end = parseInt(params.get('end'), 10);     
        console.log('Start:', start);  
        console.log('End:', end);      

        cardDeck = cardDeck.slice(start -1,end )

        renderCards()
      }

    else{
        renderCards()

    }


}
main()