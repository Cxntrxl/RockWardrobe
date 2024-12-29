window.onload = () => {
    fetch('./data/items.json')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error - ${response.status}`);
            }
            return response.json();
        })
        .then( data => {
            addButtonListeners();
            populateSections(data);
            applyTooltips();
        })
        .catch (error => {
            console.error(`Error fetching json file - ${error}`);
        });
};

function addButtonListeners(){
    document.querySelectorAll('button[LinkedContainer]').forEach(button => {
       button.addEventListener('click', () => {
          toggleSelection(button);
          toggleContainer(document.getElementById(button.getAttribute('linkedContainer')));
       });
    });
}

function createTooltipObject() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-tooltip';
    const tooltipName = document.createElement('div');
    const tooltipPrice = document.createElement('div');
    const tooltipDescription = document.createElement('div');
    tooltip.appendChild(tooltipName);
    tooltip.appendChild(tooltipPrice);
    tooltip.appendChild(tooltipDescription);
    document.body.appendChild(tooltip);
}

function applyTooltips() {
    createTooltipObject();

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
            if (tooltip) {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                const padding = 10;

                let x = event.pageX + padding;
                let y = event.pageY + padding;

                if (x + tooltipWidth > window.innerWidth) { x = event.pageX - tooltipWidth - padding; }
                if (x < 0) { x = padding; }

                if (y + tooltipHeight > window.innerHeight) { y = event.pageY - tooltipHeight - padding; }
                if (y < 0) { y = padding; }

                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            }
        });

        button.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
}

function createButton(item) {
    const button = document.createElement('button');
    button.classList.add('tooltip');
    button.classList.add('square')
    button.setAttribute('TName', item.name);

    if (item.price > 0){
        button.setAttribute('TPrice', item.price + " GC");
    } else {
        button.setAttribute('TPrice', "Free");
    }

    button.setAttribute('TDesc', item.description);

    if (item.preview && item.preview !== "icons/") {
        button.style.backgroundImage = `url(https://cxntrxl.github.io/RockWardrobe${item.preview})`;
    } else {
        button.innerHTML = item.name;
    }
    button.style.backgroundSize = 'auto 95%';
    button.style.backgroundRepeat = 'no-repeat';
    button.style.backgroundPosition = 'center';
    button.style.padding = `10%`;

    button.addEventListener('click', () => {
        toggleSelection(button);
    });

    return button;
}

function populateSections(data) {
    data.forEach((item) =>{
        const typeMapping = {
            'CharacterType':'characterTypeContainer',
            'ExpressionSet':'expressionSetContainer',
            'EyeSheen':'eyeSheenContainer',
            'TopHairstyle':'topHairstyleContainer',
            'SideHairstyle':'sideHairstyleContainer',
            'Eyebrows':'eyebrowsContainer',
            'Eyelashes':'eyelashesContainer',
            'Moustache':'moustacheContainer',
            'Beard':'beardContainer',
            'Torso':'torsoChestContainer',
            'Chestplate':'chestplateBeltContainer',
            'Pants':'legsContainer'
        }


        switch (item.type) {
            case 'Gauntlet':
                let gButtonR = createButton(item);
                let gButtonL = createButton(item);
                document.getElementById('rightGauntletContainer').appendChild(gButtonR);
                document.getElementById('leftGauntletContainer').appendChild(gButtonL);
                break;

            case 'Sleeve':
                let sButtonR = createButton(item);
                let sButtonL = createButton(item);
                document.getElementById('rightArmContainer').appendChild(sButtonR);
                document.getElementById('leftArmContainer').appendChild(sButtonL);
                break;

            case 'Boots':
                let bButtonR = createButton(item);
                let bButtonL = createButton(item);
                document.getElementById('rightBootContainer').appendChild(bButtonR);
                document.getElementById('leftBootContainer').appendChild(bButtonL);
                break;

            default:
                let containerID = typeMapping[item.type];
                if (containerID){
                    let container = document.getElementById(containerID);
                    if (container){
                        let button = createButton(item);
                        container.appendChild(button);
                    } else {
                        console.warn(`Json parse error at ${item.name}`);
                    }
                } else {
                    console.warn(`Json parse error at ${item.name}`);
                }
                break;
        }
    })
}

function toggleSelection(button) {
    button.parentElement.querySelectorAll('button')
        .forEach(btn => btn.disabled = false);
    button.disabled = true;
}

function toggleContainer(container) {
    Array.from(container.parentElement.children).forEach(child => {
        if (child === container) return;
        child.classList.add('hidden');
    });
    container.classList.remove('hidden');
}
