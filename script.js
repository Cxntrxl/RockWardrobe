import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const tooltip = document.createElement('div');
tooltip.className = 'tooltip-tooltip';
const tooltipName = document.createElement('div');
const tooltipPrice = document.createElement('div');
const tooltipDescription = document.createElement('div');
tooltip.appendChild(tooltipName);
tooltip.appendChild(tooltipPrice);
tooltip.appendChild(tooltipDescription);
document.body.appendChild(tooltip);

let items;
let totalCost;
let equippedCosmetics = new Array(18);

function setDefaultEquippedCosmetics() {
    equippedCosmetics[0] = findItem("Masculine", "CharacterType");
    equippedCosmetics[1] = findItem("Default 1", "ExpressionSet");
    equippedCosmetics[2] = findItem("Default", "EyeSheen");
    equippedCosmetics[3] = findItem("Default RumbleGuy", "TopHairstyle");
    equippedCosmetics[4] = findItem("Short Sides", "SideHairstyle");
    equippedCosmetics[5] = findItem("Sharp Eyebrows", "Eyebrows");
    equippedCosmetics[6] = findItem("Full Eyelashes", "Eyelashes");
    equippedCosmetics[7] = findItem("None", "Moustache");
    equippedCosmetics[8] = findItem("None", "Beard");
    equippedCosmetics[9] = findItem("All-Round Chestplate", "Chestplate");
    equippedCosmetics[10] = findItem("Default Gauntlet", "Gauntlet");
    equippedCosmetics[11] = findItem("Default Gauntlet", "Gauntlet");
    equippedCosmetics[12] = findItem("Default Boots", "Boots");
    equippedCosmetics[13] = findItem("Default Boots", "Boots");
    equippedCosmetics[14] = findItem("Turtle Neck Undershirt", "Torso");
    //equippedCosmetics[15] = findItem("None", "Sleeve");
    //equippedCosmetics[16] = findItem("None", "Sleeve");
    equippedCosmetics[17] = findItem("Shorts", "Pants");

    reloadModels();
}

function findItem(name, type) {
    let result = items.find(item => item.name === name && item.type === type);
    return result;
}

window.onload = () => {
    fetch('./data/items.json')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error - ${response.status}`);
            }
            return response.json();
        })
        .then( data => {
            items = data;
            addButtonListeners();
            populateSections(data);
            applyTooltips();
            console.log(items);
            setDefaultEquippedCosmetics();
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

function applyTooltips() {
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

function createButton(modelIndex, item) {
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
        selectModel(modelIndex, item);
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
                const gContainerR = document.getElementById('rightGauntletContainer');
                const gContainerL = document.getElementById('leftGauntletContainer');
                const gIndexR = gContainerR.getAttribute('modelIndex');
                const gIndexL = gContainerL.getAttribute('modelIndex');

                let gButtonR = createButton(gIndexR, item);
                let gButtonL = createButton(gIndexL, item);

                gContainerR.appendChild(gButtonR);
                gContainerL.appendChild(gButtonL);
                break;

            case 'Sleeve':
                const sContainerR = document.getElementById('rightArmContainer');
                const sContainerL = document.getElementById('leftArmContainer');
                const sIndexR = sContainerR.getAttribute('modelIndex');
                const sIndexL = sContainerL.getAttribute('modelIndex');

                let sButtonR = createButton(sIndexR, item);
                let sButtonL = createButton(sIndexL, item);

                sContainerR.appendChild(sButtonR);
                sContainerL.appendChild(sButtonL);
                break;

            case 'Boots':

                const bContainerR = document.getElementById('rightBootContainer');
                const bContainerL = document.getElementById('leftBootContainer');
                const bIndexR = bContainerR.getAttribute('modelIndex');
                const bIndexL = bContainerL.getAttribute('modelIndex');

                let bButtonR = createButton(bIndexR, item);
                let bButtonL = createButton(bIndexL, item);

                bContainerR.appendChild(bButtonR);
                bContainerL.appendChild(bButtonL);
                break;

            default:
                let containerID = typeMapping[item.type];
                if (containerID){
                    let container = document.getElementById(containerID);
                    if (container){
                        let button = createButton(
                            container.getAttribute('modelIndex'),
                            item);
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
    container.parentElement.querySelectorAll('button[selector]')
        .forEach(btn =>
            btn.disabled = !document.getElementById(
                btn.getAttribute('linkedContainer')
                ).classList.contains('hidden'));
    container.classList.remove('hidden');
}

function selectModel(index, item) {
    equippedCosmetics[index] = item;
    reloadModels();
    console.log(`Equipped cosmetic ${item.name} at index ${index}`);
}

const w = window.innerWidth;
const h = window.innerHeight;
const ratio = .6;
const scale = .7;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (w * ratio * scale) / (h / ratio * scale), 0.01, 1000);
const loader = new OBJLoader();
const modelsPath = `https://cxntrxl.github.io/RockWardrobe/models`
const modelNames = [
    '/BaseMesh/Male/Male_Head.obj',
    '/BaseMesh/Male/Male_Neck.obj',
    '/BaseMesh/Male/Male_Torso.obj',
    '/BaseMesh/Male/Male_Arm_Left.obj',
    '/BaseMesh/Male/Male_Hand_Left.obj',
    '/BaseMesh/Male/Male_Arm_Right.obj',
    '/BaseMesh/Male/Male_Hand_Right.obj',
    '/BaseMesh/Male/Male_Legs.obj',
    '/BaseMesh/Male/Male_Feet_Left.obj',
    '/BaseMesh/Male/Male_Feet_Right.obj',
    '/BaseMesh/Male/EyeLeft.obj',
    '/BaseMesh/Male/EyeRight.obj',
    '/BaseMesh/Male/TeethBot.obj',
    '/BaseMesh/Male/TeethTop.obj',
    '/BaseMesh/Male/Tounge.obj',
];

function loadModel(modelName) {
    loader.load(modelsPath + modelName, function (object) {
        scene.add(object);
        render();
    });
}

function reloadModels() {
    scene.children.forEach((object) => {
       if (object.geometry) object.geometry.dispose();
       if (object.material) {
           if (Array.isArray(object.material)) {
               object.material.forEach(mat => mat.dispose());
           } else {
               object.material.dispose();
           }
       }
       scene.remove(object);
    });

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500,500,500);
    topLight.castShadow = true;
    scene.add(topLight);

    const botLight = new THREE.DirectionalLight(0xffffff, .3);
    botLight.position.set(-500,-500,-500);
    botLight.castShadow = true;
    scene.add(botLight);

    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);

    modelNames.forEach(model => loadModel(model));
    const dualSideTypes = {
        "Sleeve": { 15: 1, 16: 0 },
        "Gauntlet": { 10: 1, 11: 0 },
        "Boots": { 12: 1, 13: 0 }
    };

    for (let i = 0; i < equippedCosmetics.length; i++) {
        if (!equippedCosmetics[i]) continue;
        const item = equippedCosmetics[i];

        if (Array.isArray(item.model)) {
            if (dualSideTypes[item.type]) {
                loadModel(item.model[dualSideTypes[item.type][i]]);
            } else {
                for (let j = 0; j < item.model.length; j++) {
                    loadModel(item.model[j]);
                }
            }
        } else {
            loadModel(item.model);
        }
    }

    totalCost = 0;
    equippedCosmetics.forEach(item => {
        totalCost += item.price;
    });
    let longGames = totalCost / 95;
    let timeEstimate = longGames * 540 / 60 + longGames * 2;
    document.getElementById('CostTimeEstimate').textContent =
    `${totalCost} Gear Coins, Est. ${Math.floor(timeEstimate*0.8)} - ${Math.floor(timeEstimate*1.2)}min Gameplay.`;
}

reloadModels()

function render() {
    renderer.render(scene, camera);
}

let renderer = new THREE.WebGLRenderer({alpha:true});
function setRenderScale(){
    renderer.setSize(w * ratio * scale, h / ratio * scale);
}

setRenderScale();
const controls = new OrbitControls(camera, renderer.domElement);

document.getElementById('PreviewRenderer').appendChild(renderer.domElement);

camera.position.set(0, 1, 2);
camera.rotation.set(-.2, 0, 0)

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    setRenderScale();
});

animate();
