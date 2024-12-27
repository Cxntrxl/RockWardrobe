const tooltip = document.createElement('div');
tooltip.className = 'tooltip-tooltip';
const tooltipName = document.createElement('div');
const tooltipPrice = document.createElement('div');
const tooltipDescription = document.createElement('div');
tooltip.appendChild(tooltipName);
tooltip.appendChild(tooltipPrice);
tooltip.appendChild(tooltipDescription);
document.body.appendChild(tooltip);

document.querySelectorAll('button[TName]').forEach(button => {
    button.addEventListener('mouseenter', event => {
        const TName = button.getAttribute('TName');
        const TPrice = button.getAttribute('TPrice');
        const TDesc = button.getAttribute('TDesc');
        tooltipName.textContent = TName;
        tooltipPrice.textContent = TPrice;
        tooltipDescription.textContent = TDesc;
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    });

    button.addEventListener('mousemove', event => {
        const offset = 10; // Distance between cursor and tooltip
        tooltip.style.left = `${event.pageX + offset}px`;
        tooltip.style.top = `${event.pageY + offset}px`;
    });

    button.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
});

const colourSelectionToggle = document.getElementById('toggleColours');
const battleSuitColoursToggle = document.getElementById('battleSuitColoursToggle');
const characterColoursToggle = document.getElementById('characterColoursToggle');
const headMarkingsColoursToggle = document.getElementById('headMarkingsColoursToggle');
const bodyMarkingsColoursToggle = document.getElementById('bodyMarkingsColoursToggle');

const modelsSelectionToggle = document.getElementById('toggleModels');
const characterModelsToggle = document.getElementById('characterModelsToggle');
const battleSuitModelsToggle = document.getElementById('battleSuitModelsToggle');
const headModelsToggle = document.getElementById('headModelsToggle');
const bodyModelsToggle = document.getElementById('bodyModelsToggle');

const identityModelsToggle = document.getElementById('identityModelsToggle');
const hairModelsToggle = document.getElementById('hairModelsToggle');
const upperLayerModelsToggle = document.getElementById('upperLayerModelsToggle');
const lowerLayerModelsToggle = document.getElementById('lowerLayerModelsToggle');
const headShapeModelsToggle = document.getElementById('headShapeModelsToggle');
const headMarkingsModelsToggle = document.getElementById('headMarkingsModelsToggle');
const bodyShapeModelsToggle = document.getElementById('bodyShapeModelsToggle');
const bodyMarkingsModelsToggle = document.getElementById('bodyMarkingsModelsToggle');

const coloursContainer = document.getElementById('coloursContainer');
const battleSuitColoursContainer = document.getElementById('battleSuitColoursContainer');
const characterColoursContainer = document.getElementById('characterColoursContainer');
const headMarkingsColoursContainer = document.getElementById('headMarkingsColoursContainer');
const bodyMarkingsColoursContainer = document.getElementById('bodyMarkingsColoursContainer');

const modelsContainer = document.getElementById('modelsContainer');
const characterModelsContainer = document.getElementById('characterModelsContainer');
const battleSuitModelsContainer = document.getElementById('battleSuitModelsContainer');
const headModelsContainer = document.getElementById('headModelsContainer');
const bodyModelsContainer = document.getElementById('bodyModelsContainer');

const identityModelsContainer = document.getElementById('identityModelsContainer');
const hairModelsContainer = document.getElementById('hairModelsContainer');
const upperLayerModelsContainer = document.getElementById('upperLayerModelsContainer');
const lowerLayerModelsContainer = document.getElementById('lowerLayerModelsContainer');
const headShapeModelsContainer = document.getElementById('headShapeModelsContainer');
const headMarkingsModelsContainer = document.getElementById('headMarkingsModelsContainer');
const bodyShapeModelsContainer = document.getElementById('bodyShapeModelsContainer');
const bodyMarkingsModelsContainer = document.getElementById('bodyMarkingsModelsContainer');

colourSelectionToggle.addEventListener('click', () => {
    coloursContainer.classList.remove('hidden');
    modelsContainer.classList.add('hidden');

    colourSelectionToggle.disabled = true;
    modelsSelectionToggle.disabled = false;
    console.log('Selected Colours.');
});

battleSuitColoursToggle.addEventListener('click', () => {
    battleSuitColoursContainer.classList.remove('hidden');
    characterColoursContainer.classList.add('hidden');
    headMarkingsColoursContainer.classList.add('hidden');
    bodyMarkingsColoursContainer.classList.add('hidden');

    battleSuitColoursToggle.disabled = true;
    characterColoursToggle.disabled = false;
    headMarkingsColoursToggle.disabled = false;
    bodyMarkingsColoursToggle.disabled = false;
    console.log('Selected Battle Suit Colours.');
});

characterColoursToggle.addEventListener('click', () => {
    battleSuitColoursContainer.classList.add('hidden');
    characterColoursContainer.classList.remove('hidden');
    headMarkingsColoursContainer.classList.add('hidden');
    bodyMarkingsColoursContainer.classList.add('hidden');

    battleSuitColoursToggle.disabled = false;
    characterColoursToggle.disabled = true;
    headMarkingsColoursToggle.disabled = false;
    bodyMarkingsColoursToggle.disabled = false;
    console.log('Selected Character Colours.');
});

headMarkingsColoursToggle.addEventListener('click', () => {
    battleSuitColoursContainer.classList.add('hidden');
    characterColoursContainer.classList.add('hidden');
    headMarkingsColoursContainer.classList.remove('hidden');
    bodyMarkingsColoursContainer.classList.add('hidden');

    battleSuitColoursToggle.disabled = false;
    characterColoursToggle.disabled = false;
    headMarkingsColoursToggle.disabled = true;
    bodyMarkingsColoursToggle.disabled = false;
    console.log('Selected Head Markings Colours.');
});

bodyMarkingsColoursToggle.addEventListener('click', () => {
    battleSuitColoursContainer.classList.add('hidden');
    characterColoursContainer.classList.add('hidden');
    headMarkingsColoursContainer.classList.add('hidden');
    bodyMarkingsColoursContainer.classList.remove('hidden');

    battleSuitColoursToggle.disabled = false;
    characterColoursToggle.disabled = false;
    headMarkingsColoursToggle.disabled = false;
    bodyMarkingsColoursToggle.disabled = true;
    console.log('Selected Body Markings Colours.');
});

modelsSelectionToggle.addEventListener('click', () => {
    coloursContainer.classList.add('hidden');
    modelsContainer.classList.remove('hidden');

    colourSelectionToggle.disabled = false;
    modelsSelectionToggle.disabled = true;
    console.log('Selected Models.');
});

characterModelsToggle.addEventListener('click', () => {
    characterModelsContainer.classList.remove('hidden');
    battleSuitModelsContainer.classList.add('hidden');
    headModelsContainer.classList.add('hidden');
    bodyModelsContainer.classList.add('hidden');

    characterModelsToggle.disabled = true;
    battleSuitModelsToggle.disabled = false;
    headModelsToggle.disabled = false;
    bodyModelsToggle.disabled = false;
    console.log('Selected Character Models.');
});

battleSuitModelsToggle.addEventListener('click', () => {
    characterModelsContainer.classList.add('hidden');
    battleSuitModelsContainer.classList.remove('hidden');
    headModelsContainer.classList.add('hidden');
    bodyModelsContainer.classList.add('hidden');

    characterModelsToggle.disabled = false;
    battleSuitModelsToggle.disabled = true;
    headModelsToggle.disabled = false;
    bodyModelsToggle.disabled = false;
    console.log('Selected Battle Suit Models.');
});

headModelsToggle.addEventListener('click', () => {
    characterModelsContainer.classList.add('hidden');
    battleSuitModelsContainer.classList.add('hidden');
    headModelsContainer.classList.remove('hidden');
    bodyModelsContainer.classList.add('hidden');

    characterModelsToggle.disabled = false;
    battleSuitModelsToggle.disabled = false;
    headModelsToggle.disabled = true;
    bodyModelsToggle.disabled = false;
    console.log('Selected Head Models.');
});

bodyModelsToggle.addEventListener('click', () => {
    characterModelsContainer.classList.add('hidden');
    battleSuitModelsContainer.classList.add('hidden');
    headModelsContainer.classList.add('hidden');
    bodyModelsContainer.classList.remove('hidden');

    characterModelsToggle.disabled = false;
    battleSuitModelsToggle.disabled = false;
    headModelsToggle.disabled = false;
    bodyModelsToggle.disabled = true;
    console.log('Selected Body Models.');
});

identityModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.remove('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = true;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

hairModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.remove('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = true;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

upperLayerModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.remove('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = true;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

lowerLayerModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.remove('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = true;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

headShapeModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.remove('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = true;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

headMarkingsModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.remove('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = true;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

bodyShapeModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.remove('hidden');
    bodyMarkingsModelsContainer.classList.add('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = true;
    bodyMarkingsModelsToggle.disabled = false;

    console.log('Selected Body Models.');
});

bodyMarkingsModelsToggle.addEventListener('click', () => {
    identityModelsContainer.classList.add('hidden');
    hairModelsContainer.classList.add('hidden');
    upperLayerModelsContainer.classList.add('hidden');
    lowerLayerModelsContainer.classList.add('hidden');
    headShapeModelsContainer.classList.add('hidden');
    headMarkingsModelsContainer.classList.add('hidden');
    bodyShapeModelsContainer.classList.add('hidden');
    bodyMarkingsModelsContainer.classList.remove('hidden');

    identityModelsToggle.disabled = false;
    hairModelsToggle.disabled = false;
    upperLayerModelsToggle.disabled = false;
    lowerLayerModelsToggle.disabled = false;
    headShapeModelsToggle.disabled = false;
    headMarkingsModelsToggle.disabled = false;
    bodyShapeModelsToggle.disabled = false;
    bodyMarkingsModelsToggle.disabled = true;

    console.log('Selected Body Models.');
});

