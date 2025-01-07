import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

const tooltip = document.createElement('div');
tooltip.className = 'tooltip-tooltip';
const tooltipName = document.createElement('div');
const tooltipPrice = document.createElement('div');
const tooltipDescription = document.createElement('div');
tooltipName.textContent = "Loading...";
tooltip.appendChild(tooltipName);
tooltip.appendChild(tooltipPrice);
tooltip.appendChild(tooltipDescription);
document.body.appendChild(tooltip);

let items;
let colours;
let markings;
let totalCost;
let equippedCosmetics = new Array(18);
let equippedBattleSuitColours = new Array(7);
let equippedCharacterColours = new Array(7);
let equippedHeadMarkings = new Array(5);
let equippedBodyMarkings = new Array(5);

function setDefaultEquippedCosmetics() {
    equipItem(findItem("Masculine", "CharacterType"), 0);
    //equipItem(findItem("Default 1", "ExpressionSet"),1);
    equipItem(findItem("Default", "EyeSheen"),2);
    equipItem(findItem("Default RumbleGuy", "TopHairstyle"),3);
    equipItem(findItem("Short Sides", "SideHairstyle"),4);
    equipItem(findItem("Sharp Eyebrows", "Eyebrows"),5);
    equipItem(findItem("Full Eyelashes", "Eyelashes"),6);
    //equipItem(findItem("None", "Moustache"),7);
    //equipItem(findItem("None", "Beard"),8);
    equipItem(findItem("All-Round Chestplate", "Chestplate"),9);
    equipItem(findItem("Default Gauntlet", "Gauntlet"),10);
    equipItem(findItem("Default Gauntlet", "Gauntlet"),11);
    equipItem(findItem("Default Boots", "Boots"),12);
    equipItem(findItem("Default Boots", "Boots"),13);
    equipItem(findItem("Turtle Neck Undershirt", "Torso"),14);
    //equipItem(findItem("None", "Sleeve"),15);
    //equipItem(findItem("None", "Sleeve"),16);
    equipItem(findItem("Shorts", "Pants"),17);

    evaluateGCCost();
}

function equipItem(item, index) {
    equippedCosmetics[index] = item;
    enableModel(item, index, equippedCosmetics[0].name === 'Masculine');
    if (index === '0') {
        enableAllModels(equippedCosmetics[0].name === 'Masculine');
    }
}

function findItem(name, type) {
    return items.find(item => item.name === name && item.type === type);
}

function enableAllModels(male) {
    for (let i = 0; i < equippedCosmetics.length; i++) {
        if (i === 0) continue;
        if (!equippedCosmetics[i]) continue;
        enableModel(equippedCosmetics[i], i.toString(), male);
    }
}

window.onload = () => {
    addButtonListeners();
    fetchCosmeticData(['./data/items.json', './data/colours.json', './data/markings.json']);
};

async function fetchCosmeticData(urls) {
    try {
        const fetchPromises = urls.map(url => fetch(url));
        const responses = await Promise.all(fetchPromises);
        const dataPromises = responses.map(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
        const data = await Promise.all(dataPromises);

        items = data[0];
        colours = data[1];
        markings = data[2];
        populateModels(items);
        await initModels();
        setDefaultEquippedCosmetics();
        await populateColours(colours);
        populateMarkings(markings);
        applyTooltips();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function addButtonListeners(){
    document.querySelectorAll('button[LinkedContainer]').forEach(button => {
       button.addEventListener('click', () => {
          toggleSelection(button);
          toggleContainer(document.getElementById(button.getAttribute('linkedContainer')));
       });
    });

    document.querySelectorAll('input[type=range][markingColourIndex]').forEach(slider => {
       slider.addEventListener('input', () => {
           if (slider.id.includes('head')){
               headMarkingColours[slider.getAttribute('markingColourIndex')].w = slider.value;
           } else {
               bodyMarkingColours[slider.getAttribute('markingColourIndex')].w = slider.value;
           }
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

function createModelButton(modelIndex, item) {
    let button = createButton(item);
    button.addEventListener('click', () => {
        selectModel(modelIndex, item);
    });
    return button;
}

function createColourButton(colourIndex, item) {
    return new Promise(async (resolve) => {
        let button = createButton(item);

        const iconUrl = await generateRecoloredIcon('./tex/Colour.png', {
            r: item.red,
            g: item.green,
            b: item.blue
        });
        button.style.backgroundImage = `url(${iconUrl})`;
        button.innerHTML = "";

        button.addEventListener('click', () => {
            selectColour(colourIndex, item);
        });

        resolve(button);
    });
}

function createMarkingButton(markingIndex, item) {
    let button = createButton(item);
    button.addEventListener('click', () => {
        selectMarking(markingIndex, item);
    });
    return button;
}

function createMarkingColourButton(markingIndex, item, type) {
    return new Promise(async (resolve) => {
        let button = createButton(item);

        const iconUrl = await generateRecoloredIcon('./tex/Colour.png', {
            r: item.red,
            g: item.green,
            b: item.blue
        });
        button.style.backgroundImage = `url(${iconUrl})`;
        button.innerHTML = "";

        button.addEventListener('click', () => {
            selectMarkingColour(markingIndex, item, type);
        });

        resolve(button);
    });
}

let colourCache = new Map();

function generateRecoloredIcon(baseIconUrl, { r, g, b }) {
    return new Promise((resolve) => {

        const colourKey = `${r}${g}${b}`
        if (colourCache.has(colourKey)) {
            console.log("WOO HOO")
            resolve(colourCache.get(colourKey));
        }

        const baseIcon = new Image();
        baseIcon.src = baseIconUrl;

        baseIcon.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size to match the icon
            canvas.width = baseIcon.width;
            canvas.height = baseIcon.height;

            // Draw the base icon onto the canvas
            ctx.drawImage(baseIcon, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Iterate over every pixel
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                // Replace black
                if (red < 50 && green < 50 && blue < 50) {
                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                }

                // Make green transparent
                if (green > 150 && red < 100 && blue < 100) {
                    data[i + 3] = 0;
                }

                // Blend black/green pixels
                if (red < 50 && green > 50 && green < 150) {
                    const greenRatio = green / 255;
                    const blackRatio = 1 - greenRatio;

                    data[i] = r * blackRatio;
                    data[i + 1] = g * blackRatio;
                    data[i + 2] = b * blackRatio;
                    data[i + 3] = 255 * greenRatio;
                }
            }

            // Put the updated image data back to the canvas
            ctx.putImageData(imageData, 0, 0);

            // Resolve with the data URL of the recolored icon
            colourCache.set(colourKey, canvas.toDataURL());
            resolve(canvas.toDataURL());
        };
    });
}

async function populateColours(data) {
    const typeMapping = {
        'LeatherPlating': 'leatherPlatingColourContainer',
        'Belt': 'beltColourContainer',
        'Metals': 'metalColourContainer',
        'Gambeson': 'gambesonColourContainer',
        'Straps': 'strapsColourContainer',
        'Undersuit': 'undersuitColourContainer',

        'Skin': 'skinColourContainer',
        'Eyes': 'eyeColourContainer',
        'Hair': 'hairColourContainer',

        'Marking': [
            'headMarkingAColourContainer',
            'headMarkingBColourContainer',
            'headMarkingCColourContainer',
            'headMarkingDColourContainer',
            'headMarkingEColourContainer',

            'bodyMarkingAColourContainer',
            'bodyMarkingBColourContainer',
            'bodyMarkingCColourContainer',
            'bodyMarkingDColourContainer',
            'bodyMarkingEColourContainer'
        ]
    };

    return new Promise(async (resolve) => {
        for (const item of data) {
            let containerID = typeMapping[item.type];
            if (containerID) {
                if (Array.isArray(containerID)) {
                    for (const id of containerID) {
                        let container = document.getElementById(id);
                        if (container) {
                            const button = await createMarkingColourButton(
                                container.getAttribute('markingColourIndex'),
                                item,
                                id.includes('head')
                            );
                            container.appendChild(button);
                        } else {
                            console.warn(`Json parse error at ${item.name}`);
                        }
                    }
                } else {
                    let container = document.getElementById(containerID);
                    if (container) {
                        const button = await createColourButton(
                            container.getAttribute('colourIndex'),
                            item
                        );
                        container.appendChild(button);
                    } else {
                        console.warn(`Json parse error at ${item.name}`);
                    }
                }
            } else {
                console.warn(`Json parse error at ${item.name}`);
            }
        }
        resolve();
    });
}

function populateModels(data) {
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
            'Pants':'legsContainer',
        }

        switch (item.type) {
            case 'Gauntlet':
                const gContainerR = document.getElementById('rightGauntletContainer');
                const gContainerL = document.getElementById('leftGauntletContainer');
                const gIndexR = gContainerR.getAttribute('modelIndex');
                const gIndexL = gContainerL.getAttribute('modelIndex');

                let gButtonR = createModelButton(gIndexR, item);
                let gButtonL = createModelButton(gIndexL, item);

                gContainerR.appendChild(gButtonR);
                gContainerL.appendChild(gButtonL);
                break;

            case 'Sleeve':
                const sContainerR = document.getElementById('rightArmContainer');
                const sContainerL = document.getElementById('leftArmContainer');
                const sIndexR = sContainerR.getAttribute('modelIndex');
                const sIndexL = sContainerL.getAttribute('modelIndex');

                let sButtonR = createModelButton(sIndexR, item);
                let sButtonL = createModelButton(sIndexL, item);

                sContainerR.appendChild(sButtonR);
                sContainerL.appendChild(sButtonL);
                break;

            case 'Boots':

                const bContainerR = document.getElementById('rightBootContainer');
                const bContainerL = document.getElementById('leftBootContainer');
                const bIndexR = bContainerR.getAttribute('modelIndex');
                const bIndexL = bContainerL.getAttribute('modelIndex');

                let bButtonR = createModelButton(bIndexR, item);
                let bButtonL = createModelButton(bIndexL, item);

                bContainerR.appendChild(bButtonR);
                bContainerL.appendChild(bButtonL);
                break;

            default:
                let containerID = typeMapping[item.type];
                if (containerID){
                    let container = document.getElementById(containerID);
                    if (container){
                        let button = createModelButton(
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

function populateMarkings(data) {
    data.forEach((item) =>{
        const typeMapping = {
            'Head': 0,
            'Body': 1,
        }

        let containerID;
        if (typeMapping[item.type] === 0) {
            containerID = [
                'headMarkingAContainer',
                'headMarkingBContainer',
                'headMarkingCContainer',
                'headMarkingDContainer',
                'headMarkingEContainer'
            ]
        } else {
            containerID = [
                'bodyMarkingAContainer',
                'bodyMarkingBContainer',
                'bodyMarkingCContainer',
                'bodyMarkingDContainer',
                'bodyMarkingEContainer'
            ]
        }

        if (containerID){
            containerID.forEach(id => {
                let container = document.getElementById(id);
                if (container){
                    let button = createMarkingButton(
                        container.getAttribute('markingIndex'),
                        item);
                    container.appendChild(button);
                } else {
                    console.warn(`Json parse error at ${item.name}`);
                }
            })
        } else {
            console.warn(`Json parse error at ${item.name}`);
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
    equipItem(item, index);
    evaluateGCCost();
}

function selectColour(index, item) {
    const typeMap = {
        'LeatherPlating': 0,
        'Belt': 0,
        'Metals': 0,
        'Gambeson': 0,
        'Straps': 0,
        'Undersuit': 0,

        'Skin': 1,
        'Eyes': 1,
        'Hair': 1,
    }
    let r = parseFloat(item.red) / 255.0;
    let g = parseFloat(item.green) / 255.0;
    let b = parseFloat(item.blue) / 255.0;

    switch (typeMap[item.type]){
        case 0:
            battleSuitColours[index] = new THREE.Vector3(r, g, b);
            characterColours[2] = battleSuitColours[2];
            equippedBattleSuitColours[index] = item;
            break;
        case 1:
            characterColours[index] = new THREE.Vector3(r, g, b);
            characterColours[2] = battleSuitColours[2];
            equippedCharacterColours[index] = item;
            break;
    }
    evaluateGCCost();
}

function selectMarking(index, item) {
    let marking;
    if (item.type === 'Head') {
        marking = loadedHeadMarkings.find(marking => (marking.name === item.texture));
        headMarkings[index] = marking;
        equippedHeadMarkings[index] = item;
        headMarkingMaterials.forEach(mat => {
            mat.uniforms.decals.value = headMarkings;
        })
    } else {
        marking = loadedBodyMarkings.find(marking => (marking.name === item.texture));
        bodyMarkings[index] = marking;
        equippedBodyMarkings[index] = item;
        bodyMarkingMaterials.forEach(mat => {
            mat.uniforms.decals.value = bodyMarkings;
        })
    }

    evaluateGCCost();
}

function selectMarkingColour(index, item, head) {
    let r = parseFloat(item.red) / 255.0;
    let g = parseFloat(item.green) / 255.0;
    let b = parseFloat(item.blue) / 255.0;

    if (head) {
        headMarkingColours[index] = new THREE.Vector4(r, g, b, 1.0);
    } else {
        bodyMarkingColours[index] = new THREE.Vector4(r, g, b, 1.0);
    }
}

const previewContainer = document.getElementById("PreviewRenderer");
const ratio = 1;
const scale = 1;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, previewContainer.clientWidth / (previewContainer.clientHeight || 1), 0.01, 1000);
const loader = new OBJLoader();
const modelsPath = 'https://cxntrxl.github.io/RockWardrobe/models'
const texturePath = 'https://cxntrxl.github.io/RockWardrobe/tex'
const textureLoader = new THREE.TextureLoader();
let renderer = new THREE.WebGLRenderer({alpha:true});

let baseColourTexture;
let maskTexture;
const itemTypeMap = {
    'CharacterType':'Character',
    'EyeSheen':'Character',
    'TopHairstyle':'Character',
    'SideHairstyle':'Character',
    'Eyebrows':'Character',
    'Eyelashes':'Character',
    'Moustache':'Character',
    'Beard':'Character',
    'Torso':'BattleSuit',
    'Chestplate':'BattleSuit',
    'Sleeve':'BattleSuit',
    'Gauntlet':'BattleSuit',
    'Pants':'BattleSuit',
    'Boots':'BattleSuit'
}

let battleSuitColours = [
    new THREE.Vector3(185/255, 105/255, 78/255),
    new THREE.Vector3(53/255, 45/255, 42/255),
    new THREE.Vector3(183/255, 180/255, 163/255),
    new THREE.Vector3(153/255, 146/255, 127/255),
    new THREE.Vector3(193/255, 178/255, 148/225),
    new THREE.Vector3(110/255, 90/255, 79/255),
    new THREE.Vector3(105/255, 109/255, 112/255)
]

let characterColours = [
    new THREE.Vector3(222/255, 128/255, 95/255),
    new THREE.Vector3(208/255, 164/255, 137/255),
    new THREE.Vector3(53/255, 45/255, 42/255),
    new THREE.Vector3(218/255, 210/255, 184/255),
    new THREE.Vector3(0/255, 0/255, 255/225),
    new THREE.Vector3(148/255, 110/255, 89/255),
    new THREE.Vector3(67/255, 63/255, 60/255)
]

let eyeColours = [
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1.0, 1.0, 0.0),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, 1, 1)
]

let debugColours = [
    new THREE.Vector3(1, 0, 0), //Red
    new THREE.Vector3(1, .5, 0), //Orange
    new THREE.Vector3(1, 1, 0), //Yellow
    new THREE.Vector3(0, 1, 0), //Green
    new THREE.Vector3(0, 0, 1), //Blue
    new THREE.Vector3(0, 1, 1), //Cyan
    new THREE.Vector3(1, 0, 1) //Magenta
]

let loadedHeadMarkings = []
let loadedBodyMarkings = []
let headMarkings = new Array(5);
let bodyMarkings = new Array(5);
let headMarkingColours = new Array(5).fill(new THREE.Vector4(0.28, 0.28, 0.28, 0.8));
let bodyMarkingColours = new Array(5).fill(new THREE.Vector4(0.28, 0.28, 0.28, 0.8));
let headMarkingMaterials = []
let bodyMarkingMaterials = []

let materials = [];

// Custom shader material
const customMaterial = new THREE.ShaderMaterial({
    uniforms: {
        baseColour: { value: baseColourTexture },
        mask: { value: maskTexture },
        zoneColors: { value: [
                new THREE.Vector3(1.0, 0.0, 0.0), // Red
                new THREE.Vector3(1.0, 0.5, 0.0), // Orange
                new THREE.Vector3(1.0, 1.0, 0.0), // Yellow
                new THREE.Vector3(0.0, 1.0, 0.0), // Green
                new THREE.Vector3(0.0, 0.0, 1.0), // Blue
                new THREE.Vector3(0.0, 1.0, 1.0), // Cyan
                new THREE.Vector3(1.0, 0.0, 1.0)  // Magenta
            ] },
        lightDirection: { value: new THREE.Vector3(1.0, 1.0, 1.0).normalize() },
        ambientLight: { value: 0.45 },
        userData: { value: false },
        decals: { value: Array(5).fill(null) }, // Decal textures
        decalColors: { value: Array(5).fill(new THREE.Vector4(0.0, 0.0, 0.0, 0.0)) },
        decalCount: { value: 5 },
        mainSaturation: {value: 1.0},
        mainBrightness: {value: 1.3},
        metalBandAThreshold: {value: 0.0},
        metalBandASaturation: {value: 1.0},
        metalBandABrightness: {value: 0.8},
        metalBandBThreshold: {value: 0.5},
        metalBandBSaturation: {value: 1.0},
        metalBandBBrightness: {value: 1.1},
        metalBandCThreshold: {value: 0.9},
        metalBandCSaturation: {value: 0.85},
        metalBandCBrightness: {value: 1.1},
        lookDir: {value: new THREE.Vector3(0.0, 0.0, 0.0)}
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
            vUv = uv;
            vNormal = normalMatrix * normal; // Transform normal to view space
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D baseColour;
uniform sampler2D mask;
uniform vec3 zoneColors[7];
uniform vec3 lightDirection;
uniform float ambientLight;

uniform sampler2D decals[5];
uniform vec4 decalColors[5];

float brightness = 1.15; // New uniform for brightness adjustment
float saturation = 1.1; // New uniform for saturation adjustment

uniform float mainSaturation;
uniform float mainBrightness;

uniform float metalBandAThreshold;
uniform float metalBandASaturation;
uniform float metalBandABrightness;

uniform float metalBandBThreshold;
uniform float metalBandBSaturation;
uniform float metalBandBBrightness;

uniform float metalBandCThreshold;
uniform float metalBandCSaturation;
uniform float metalBandCBrightness;

uniform vec3 lookDir;

vec3 adjustSaturation(vec3 color, float saturationLevel) {
    float intensity = dot(color, vec3(0.3, 0.59, 0.11)); // Perceived luminance
    return mix(vec3(intensity), color, saturationLevel);
}

vec3 rgbToHsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 6.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 hueShift(vec3 color, float shift) {
    vec3 hsv = rgbToHsv(color);   // Convert to HSV
    hsv.x = fract(hsv.x + shift); // Adjust hue, wrap around using fract()
    return hsvToRgb(hsv);         // Convert back to RGB
}

void main() {
    saturation = mainSaturation;
    brightness = mainBrightness;
    vec4 baseTex = texture2D(baseColour, vUv);
    vec4 maskTex = texture2D(mask, vUv);

    vec3 outputColor = vec3(0.0);
    if (maskTex.r > 0.5 && maskTex.g < 0.5 && maskTex.b < 0.5) outputColor = zoneColors[0]; // Red zone
    else if (maskTex.r > 0.5 && maskTex.g > 0.3 && maskTex.g < 0.7 && maskTex.b < 0.5) outputColor = zoneColors[1]; // Orange zone
    else if (maskTex.r > 0.5 && maskTex.g > 0.5 && maskTex.b < 0.5) outputColor = zoneColors[2]; // Yellow zone
    else if (maskTex.r < 0.5 && maskTex.g > 0.5 && maskTex.b < 0.5) outputColor = zoneColors[3]; // Green zone
    else if (maskTex.r < 0.5 && maskTex.g < 0.5 && maskTex.b > 0.5) outputColor = zoneColors[4]; // Blue zone
    else if (maskTex.r < 0.5 && maskTex.g > 0.5 && maskTex.b > 0.5) outputColor = zoneColors[5]; // Cyan zone
    else if (maskTex.r > 0.5 && maskTex.g < 0.5 && maskTex.b > 0.5) outputColor = zoneColors[6]; // Magenta zone
    else if (maskTex.r < 0.5 && maskTex.g < 0.5 && maskTex.b < 0.5) outputColor = vec3(1.0, 1.0, 1.0);

    // Apply decals manually
    vec4 decalTex0 = texture2D(decals[0], vUv);
    vec4 decalTex1 = texture2D(decals[1], vUv);
    vec4 decalTex2 = texture2D(decals[2], vUv);
    vec4 decalTex3 = texture2D(decals[3], vUv);
    vec4 decalTex4 = texture2D(decals[4], vUv);
    
    if (maskTex.r > 0.5 && maskTex.g > 0.3 && maskTex.g < 0.7 && maskTex.b < 0.5) {
        outputColor = mix(outputColor, decalColors[4].rgb, decalTex4.r * decalColors[4].a);
        outputColor = mix(outputColor, decalColors[3].rgb, decalTex3.r * decalColors[3].a);
        outputColor = mix(outputColor, decalColors[2].rgb, decalTex2.r * decalColors[2].a);
        outputColor = mix(outputColor, decalColors[1].rgb, decalTex1.r * decalColors[1].a);
        outputColor = mix(outputColor, decalColors[0].rgb, decalTex0.r * decalColors[0].a);
    }

    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightDirection);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float lightIntensity = mix(ambientLight, 1.0, diffuse);
    float toonShading = 1.0;
    
    if (maskTex.r < 0.5 && maskTex.g > 0.5 && maskTex.b < 0.5) {
        float diffuse = max(dot(normal, lookDir), 0.0);
        float lightIntensity = mix(ambientLight, 1.0, diffuse);
    
        if (lightIntensity < metalBandBThreshold) {
            lightIntensity = 0.95;
            saturation = metalBandASaturation;
            brightness = metalBandABrightness;
         }
        else if (lightIntensity < metalBandCThreshold) {
            lightIntensity = 0.8;
            saturation = metalBandBSaturation;
            brightness = metalBandBBrightness;
        }
        else {
            lightIntensity = 1.6;
            saturation = metalBandCSaturation;
            brightness = metalBandCBrightness;
        }
    
        toonShading = (floor(lightIntensity * 3.0) / 3.0);

        // Specular highlight for the green zone
        /*vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0)); // Assume camera view direction along +Z
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 2.0); // Shininess factor
        float highlight = smoothstep(0.8, 1.0, spec);
        outputColor += vec3(highlight); // Add the highlight to the outputColor
        if (toonShading > 0.5) outputColor = hueShift(outputColor, -0.03);*/
    } else {
        toonShading = floor(lightIntensity * 3.0) / 3.0;
    }

    float texBrightness = baseTex.r;
    vec3 finalColor = outputColor * texBrightness * (ambientLight + (toonShading * (1.0 - ambientLight)));

    // Adjust brightness and saturation
    finalColor *= brightness; // Apply brightness adjustment
    finalColor = adjustSaturation(finalColor, saturation); // Apply saturation adjustment

    gl_FragColor = vec4(finalColor, 1.0);
}
    `,
    lights: false
});

async function loadModel(modelName, baseColour, ID, itemType, itemIndex) {
    if (!modelName) return;

    const markingTypeMap = {
        "/BaseMesh/Male/Male_Arm_Left.obj":0,
        "/BaseMesh/Male/Male_Arm_Right.obj":0,
        "/BaseMesh/Male/Male_Legs.obj":0,
        "/BaseMesh/Male/Male_Neck.obj":0,
        "/BaseMesh/Male/Male_Torso.obj":0,
        "/BaseMesh/Male/Male_Feet_Left.obj":0,
        "/BaseMesh/Male/Male_Feet_Right.obj":0,
        "/BaseMesh/Female/Female_Arm_Left.obj":0,
        "/BaseMesh/Female/Female_Arm_Right.obj":0,
        "/BaseMesh/Female/Female_Legs.obj":0,
        "/BaseMesh/Female/Female_Neck.obj":0,
        "/BaseMesh/Female/Female_Torso.obj":0,
        "/BaseMesh/Female/Female_Feet_Left.obj":0,
        "/BaseMesh/Female/Female_Feet_Right.obj":0,

        "/BaseMesh/Male/Male_Head.obj":1,
        "/BaseMesh/Female/Female_Head.obj":1
    }

    return new Promise((resolve, reject) => {
        loader.load(
            modelsPath + modelName,
            function (object) {
                object.traverse(function (child) {
                    if (child.isMesh) {
                        const materialInstance = customMaterial.clone();
                        materials.push(materialInstance);
                        if (itemTypeMap[itemType] === 'BattleSuit') {
                            materialInstance.uniforms.zoneColors.value = battleSuitColours;
                        } else if (itemTypeMap[itemType] === 'Character') {
                            materialInstance.uniforms.zoneColors.value = characterColours;
                        } else if (itemTypeMap[itemType] === 'Eyes') {
                            materialInstance.uniforms.zoneColors.value = eyeColours;
                        }

                        if (markingTypeMap[modelName] !== undefined) {
                            if (markingTypeMap[modelName] === 0) {
                                materialInstance.uniforms.decals.value = bodyMarkings;
                                materialInstance.uniforms.decalColors.value = bodyMarkingColours;
                                bodyMarkingMaterials.push(materialInstance);
                            } else {
                                materialInstance.uniforms.decals.value = headMarkings;
                                materialInstance.uniforms.decalColors.value = headMarkingColours;
                                headMarkingMaterials.push(materialInstance);
                            }
                        }

                        if (baseColour)
                            materialInstance.uniforms.baseColour.value = textureLoader.load(texturePath + baseColour);
                        if (ID)
                            materialInstance.uniforms.mask.value = textureLoader.load(texturePath + ID);
                        child.material = materialInstance; // Apply custom material to meshes
                    }
                });
                object.name = itemIndex + "." + modelName;
                object.visible = false;

                scene.add(object);
                render();
                resolve(); // Resolve the promise when the model is loaded
            },
            undefined, // onProgress
            function (error) {
                resolve();
            }
        );
    });
}

async function loadMarking(textureName, type){
    return new Promise((resolve) => {
        textureLoader.load(
            texturePath + textureName,
            function (object) {
                object.name = textureName;
                if (type === 'Head') {
                    loadedHeadMarkings.push(object);
                } else {
                    loadedBodyMarkings.push(object);
                }
                resolve();
            },
            undefined,
            function (error) {
                resolve();
            }
        );
    });
}

function evaluateGCCost() {
    totalCost = 0;
    for (let i = 0; i < equippedCosmetics.length; i++) {
        if (!equippedCosmetics[i]) continue;
        if (i > 0) {
            if (equippedCosmetics[i] === equippedCosmetics[i - 1]) continue;
        }
        totalCost += equippedCosmetics[i].price;
    }
    equippedBattleSuitColours.forEach(item => {
       totalCost += item.price;
    });
    equippedCharacterColours.forEach(item => {
       totalCost += item.price;
    });
    equippedHeadMarkings.forEach(item => {
        totalCost += item.price;
    });
    equippedBodyMarkings.forEach(item => {
        totalCost += item.price;
    });
    let longGames = totalCost / 95;
    let timeEstimate = longGames * 540 / 60 + longGames * 2;
    document.getElementById('CostTimeEstimate').textContent =
    `${totalCost} Gear Coins, Est. ${formatTime(timeEstimate * 0.8)} - ${formatTime(timeEstimate * 1.2)} Gameplay.`;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours <= 0) {
        return `${String(mins)} minutes`
    }
    return `${String(hours)} hours, ${String(mins).padStart(2, '0')} minutes`;
}

async function initModels() {
    const indexMap = {
        'CharacterType':0,
        'ExpressionSet':1,
        'EyeSheen':2,
        'TopHairstyle':3,
        'SideHairstyle':4,
        'Eyebrows':5,
        'Eyelashes':6,
        'Moustache':7,
        'Beard':8,
        'Chestplate':9,
        'Gauntlet':10,
        'Boots':12,
        'Torso':14,
        'Sleeve':15,
        'Pants':17
    }

    let loadPromises = []

    for (let i = 0; i < items.length; i++) {
        if (!items[i]) continue;
        const item = items[i];

        if (Array.isArray(item.model)) {
            for (let j = 0; j < item.model.length; j++) {
                if(item.type === 'CharacterType' || item.type === 'EyeSheen') {
                    if(Array.isArray(item.texture)){
                        loadPromises.push(loadModel(item.model[j], item.texture[j], item.ids[j], item.type, indexMap[item.type]));
                    } else {
                        loadPromises.push(loadModel(item.model[j], item.texture, item.ids, item.type, indexMap[item.type]));
                    }
                } else {
                    if(Array.isArray(item.texture)){
                        loadPromises.push(loadModel(item.model[j], item.texture[j], item.ids[j], item.type, indexMap[item.type] + j));
                        if (item.femaleModel) loadPromises.push(loadModel(item.femaleModel[j], item.texture[j], item.ids[j], item.type, indexMap[item.type] + j));
                    } else {
                        loadPromises.push(loadModel(item.model[j], item.texture, item.ids, item.type, indexMap[item.type] + j));
                        if (item.femaleModel) loadPromises.push(loadModel(item.femaleModel[j], item.texture, item.ids, item.type, indexMap[item.type] + j));
                    }
                }
            }
        } else {
            loadPromises.push(loadModel(item.model, item.texture, item.ids, item.type, indexMap[item.type]));
            if (item.femaleModel) loadPromises.push(loadModel(item.femaleModel, item.texture, item.ids, item.type, indexMap[item.type]));
        }
    }

    for (let i = 0; i < markings.length; i++) {
        loadPromises.push(loadMarking(markings[i].texture, markings[i].type));
    }
    
    await Promise.all(loadPromises);
    console.log("All models should be loaded.")
}

function enableModel(item, index, male) {
    scene.children.forEach(model => {
        let modelIndex = model.name.split('.')[0];
        if (modelIndex === index) {
            model.visible = false;
        }
    })

    if (item.name === 'None') return;

    scene.children.forEach(model => {
        let modelIndex = model.name.split('.')[0];
        let modelName = model.name.split('.')[1];
        if (modelIndex === index.toString()) {
            if (male || !item.femaleModel) {
                if (Array.isArray(item.model) && item.model.some(name => name.startsWith(modelName))) {
                    model.visible = true;
                } else if (item.model === modelName || model.name.endsWith(item.model) || (model.name + '.obj').endsWith(item.model)) {
                    model.visible = true;
                }
            } else if (item.femaleModel) {
                if (Array.isArray(item.femaleModel) && item.femaleModel.some(name => name.startsWith(modelName))) {
                    model.visible = true;
                } else if (item.femaleModel === modelName || model.name.endsWith(item.femaleModel) || (model.name + '.obj').endsWith(item.femaleModel)) {
                    model.visible = true;
                }
            }

        }
    });
}

function render() {
    renderer.render(scene, camera);
}

function setRenderScale() {
    const width = previewContainer.clientWidth * scale;
    const height = (previewContainer.clientWidth / ratio) * scale;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

setRenderScale();
const controls = new OrbitControls(camera, renderer.domElement);

previewContainer.appendChild(renderer.domElement);

camera.position.set(0, 1, 1.4);
camera.rotation.set(-.2, 0, 0);

controls.target.set(0, .8, 0);
controls.update();

function animate() {
    requestAnimationFrame(animate);

    materials.forEach(material => {
        material.uniforms.lookDir.value.copy(new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion));
    });

    renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    setRenderScale();
});

animate();
