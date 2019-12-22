'use strict';
class CgolPitch extends HTMLElement {
    constructor() {
        super();
        this.width = 60;
        this.height = 25;
        var currentDiv = document.getElementById('container');
        this.createElement(currentDiv);
    }

    deleteElement() {
        const id = 'row';
        for (let index = 0; index < this.height; index++) {
            document.getElementById(id + index).remove();
        }
    }

    createElement(currentDiv) {
        var cell = document.createElement('div');
        cell.id = 'Alpha';
        cell.style.textAlign = 'center';
        document.body.insertBefore(cell, currentDiv);
        for (var i = 0; i < this.height; i++) {
            var div1 = document.createElement('div');
            for (var j = 0; j < this.width; j++) {
                var div = document.createElement('div');
                div.addEventListener('click', e => this.clickedDiv());
                div.style.width = '25px';
                div.style.height = '25px';
                div.style.background = this.deathColor;
                div.style.display = 'inline-block';
                div.style.margin = '0px';
                div.style.border = '0.5px solid black';
                div.id = i + 'x' + j;
                div1.appendChild(div);
            }
            div1.style.height = '25px';
            const idRow = 'row';
            div1.id = idRow + i;
            cell.appendChild(div1);
        }
        initializeGameField(this.width, this.height);
    }

    clickedDiv() {
        console.log('clicked');
        console.log(event);
        console.log(event.target.id);
        const id = event.target.id;
        const item = document.getElementById(id);
        const strId = id.split('x');
        const i = strId[0];
        const j = strId[1];
        if (gameField[i][j].lifeState === LifeState.Death) {
            item.style.backgroundColor = this.aliveColor;
            gameField[i][j].lifeState = LifeState.Alive;
            gameField[i][j].livedOnce = true;
        } else if (gameField[i][j].lifeState === LifeState.Alive) {
            item.style.backgroundColor = this.livedOnceColor;
            gameField[i][j].lifeState = LifeState.Death;
        }
    }

    connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
        </style>
        <div style="display: inline-block; vertical-align:top;" id= "container">
        </div>
`;
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    disconnectedCallback() {
    }
}
let gameField = [[], []];
let gameFieldNextGeneration = [[], []];
let gameFieldByButton = [[], []];
let witdh = 10;
let height = 10;
let playing = false;
let timer;
const time = 100;
let generationTime = 0;
let aliveColor;
let deathColor;
let livedOnceColor;
function playGame() {
    const hasChanged = checkField();
    if (playing) {
        timer = setTimeout(playGame, time);
        if (!hasChanged) {
            pauseButtonHandler();
        }
        generationTime++;
    }
    var gen = document.getElementById('idGenerationCounter');
    gen.innerHTML = String(generationTime);
}
function checkField() {
    let hasChanged = false;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < witdh; j++) {
            const isChanged = checkRules(i, j);
            if (isChanged === true) {
                hasChanged = true;
            }
        }
    }
    updateGameField();
    updateView();
    return hasChanged;
}
function updateView() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < witdh; j++) {
            var cell = document.getElementById(i + 'x' + j);
            if (gameField[i][j].lifeState === LifeState.Death) {
                if (gameField[i][j].livedOnce) {
                    cell.style.backgroundColor = livedOnceColor.value;
                } else {
                    cell.style.backgroundColor = deathColor.value;
                }
            } else {
                gameField[i][j].livedOnce = true;
                cell.style.backgroundColor = aliveColor.value;
            }
        }
    }
}
function updateGameField() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < witdh; j++) {
            gameField[i][j].lifeState = gameFieldNextGeneration[i][j].lifeState;
            gameFieldNextGeneration[i][j].lifeState = LifeState.Death;
        }
    }
}
function checkRules(row, column) {
    const counterAliveNeighbors = countAliveNeighbors(row, column);
    let changedState = false;
    if (gameField[row][column].lifeState === LifeState.Alive) {
        if (counterAliveNeighbors < 2) {
            if (gameFieldNextGeneration[row][column].lifeState !== LifeState.Death) {
                changedState = true;
            }
            gameFieldNextGeneration[row][column].lifeState = LifeState.Death;
        } else if (counterAliveNeighbors === 2 || counterAliveNeighbors === 3) {
            if (gameFieldNextGeneration[row][column].lifeState !== LifeState.Alive) {
                changedState = true;
            }
            gameFieldNextGeneration[row][column].lifeState = LifeState.Alive;
        } else if (counterAliveNeighbors > 3) {
            if (gameFieldNextGeneration[row][column].lifeState !== LifeState.Death) {
                changedState = true;
            }
            gameFieldNextGeneration[row][column].lifeState = LifeState.Death;
        }
    } else if (gameField[row][column].lifeState === LifeState.Death) {
        if (counterAliveNeighbors === 3) {
            if (gameFieldNextGeneration[row][column].lifeState !== LifeState.Alive) {
                changedState = true;
            }
            gameFieldNextGeneration[row][column].lifeState = LifeState.Alive;
        }
    }
    return changedState;
}
function countAliveNeighbors(row, column) {
    let count = 0;
    /*
    let helpRow;
    let helpColum;

    if (row - 1 >= 0) {
        if (gameField[row - 1][column].lifeState === LifeState.Alive) {
            count++;
        }
    }
    else {
        if (gameField[height - 1][column].lifeState === LifeState.Alive) {
            count++;
        }
    }

    if (row - 1 >= 0 && column - 1 >= 0) {
        if (gameField[row - 1][column - 1].lifeState === LifeState.Alive) {
            count++;
        }
    }
    else
    {
        if(row < 0 && column < 0)
        {
            if (gameField[height - 1][witdh - 1].lifeState === LifeState.Alive) {
                count++;
            }
        }
        else if(row < 0 && column >= 0)
        {
            if (gameField[height - 1][column - 1].lifeState === LifeState.Alive) {
                count++;
            }
        }
        else
        {
            if (gameField[row - 1][witdh - 1].lifeState === LifeState.Alive) {
                count++;
            }
        }
    }

    if (row - 1 >= 0 && column + 1 < witdh) {
        if (gameField[row - 1][column + 1].lifeState === LifeState.Alive) {
            count++;
        }
    }
    else
    {

    }

    if (column - 1 >= 0) {
        if (gameField[row][column - 1].lifeState === LifeState.Alive) {
            count++;
        }
    }
    else {
        if (gameField[row][witdh - 1].lifeState === LifeState.Alive) {
            count++;
        }
    }

    if (column + 1 < witdh) {
        if (gameField[row][column + 1].lifeState === LifeState.Alive) {
            count++;
        }
    }
    else {
        if (gameField[row][0].lifeState === LifeState.Alive) {
            count++;
        }
    }

    if (row + 1 < height) {
        if (gameField[row + 1][column].lifeState === LifeState.Alive) {
            count++;
        }
    }
    else {
        if (gameField[0][column].lifeState === LifeState.Alive) {
            count++;
        }
    }

    if (row + 1 < height && column - 1 >= 0) {
        if (gameField[row + 1][column - 1].lifeState === LifeState.Alive) {
            count++;
        }
    }

    if (row + 1 < height && column + 1 < witdh) {
        if (gameField[row + 1][column + 1].lifeState === LifeState.Alive) {
            count++;
        }
    } */
    for (let currentRow = row - 1; currentRow <= row + 1; currentRow++) {
        for (let currentColumn = column - 1; currentColumn <= column + 1; currentColumn++) {
            if (currentRow === row && currentColumn === column) {
                continue;
            }
            let helpRow = currentRow;
            let helpColumn = currentColumn;
            if (currentRow < 0) {
                helpRow = height - 1;
            } else if (currentRow > height - 1) {
                helpRow = 0;
            }
            if (currentColumn < 0) {
                helpColumn = witdh - 1;
            } else if (currentColumn > witdh - 1) {
                helpColumn = 0;
            }
            if (gameField[helpRow][helpColumn].lifeState === LifeState.Alive) {
                count++;
            }
        }
    }
    return count;
}
function initializeGameField(x, y) {
    witdh = x;
    height = y;
    gameField = new Array(y);
    gameFieldNextGeneration = new Array(y);
    gameFieldByButton = new Array(y);
    for (let i = 0; i < y; i++) {
        gameField[i] = new Array(y);
        gameFieldNextGeneration[i] = new Array(y);
        gameFieldByButton[i] = new Array(y);
        for (let j = 0; j < x; j++) {
            gameField[i][j] = new GameObject();
            gameFieldNextGeneration[i][j] = new GameObject();
            gameFieldByButton[i][j] = new GameObject();
        }
    }
}
function resetGrid() {
    let i = 0;
    while (i < height) {
        let j = 0;
        while (j < witdh) {
            gameField[i][j] = new GameObject();
            gameFieldNextGeneration[i][j] = new GameObject();
            gameFieldByButton[i][j] = new GameObject();
            j++;
        }
        i++;
    }
}
class GameObject {
    constructor() {
        this.lifeState = LifeState.Death;
        this.livedOnce = false;
    }
}
var LifeState;
(function (LifeState) {
    LifeState[LifeState.Death = 0] = 'Death';
    LifeState[LifeState.Alive = 1] = 'Alive';
})(LifeState || (LifeState = {}));
function setUp() {
    const startButton = document.getElementById('startButton');
    startButton.onclick = startPauseButtonhandler;
    const clearButton = document.getElementById('clearButton');
    clearButton.onclick = clearButtonhandler;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.onclick = pauseButtonHandler;
    const setSizeButton = document.getElementById('setSizeButton');
    const loadLevelButton = document.getElementById('loadLevelButton');
    const changeColorButton = document.getElementById('changeColorButton');
    const heightSize = document.getElementById('inputHeight');
    const widthSize = document.getElementById('inputWidth');
    const inputTextArea = document.getElementById('inputTextArea');
    aliveColor = document.getElementById('aliveColor');
    deathColor = document.getElementById('deathColor');
    livedOnceColor = document.getElementById('livedOnceColor');
    changeColorButtonHandler();
    setSizeButton.addEventListener('click', e => setSizeButtonhandler(heightSize.value, widthSize.value));
    loadLevelButton.addEventListener('click', e => loadLevelButtonHandler(inputTextArea.value));
    changeColorButton.addEventListener('click', e => changeColorButtonHandler());
}
function changeColorButtonHandler() {
    const pith = document.getElementsByTagName('cgol-pitch')[0];
    pith.aliveColor = aliveColor.value;
    pith.livedOnceColor = livedOnceColor.value;
    pith.deathColor = deathColor.value;
    updateView();
}
function loadLevelButtonHandler(input) {
    let maxCol = 0;
    let normalCol = 0;
    let normalRow = 1;
    for (let index = 0; index < input.length; index++) {
        if (input[index] === '\n') {
            normalRow++;
            normalCol = 0;
            continue;
        }
        normalCol++;
        if (normalCol > maxCol) {
            maxCol = normalCol;
        }
    }
    console.log('MaxCol ' + maxCol + 'Row ' + normalRow);
    setSizeButtonhandler(normalRow, maxCol);
    resetGrid();
    updateView();
    clearGenerationCounter();
    let rows = 0;
    let cols = 0;
    for (let index = 0; index < input.length; index++) {
        if (rows >= gameField.length) {
            break;
        }
        if (input[index] === '\n') {
            rows++;
            cols = 0;
            console.log(rows);
            continue;
        }
        if (input[index] === '1' && cols < gameField[0].length) {
            gameField[rows][cols].lifeState = LifeState.Alive;
            cols++;
        }
        if (input[index] === '0' && cols < gameField[0].length) {
            cols++;
        }
    }
    updateView();
}
function setSizeButtonhandler(heightSize, widthSize) {
    if (heightSize == null || heightSize < 10) {
        return;
    }
    if (widthSize == null || widthSize === undefined || widthSize < 10) {
        return;
    }
    playing = false;
    const pith = document.getElementsByTagName('cgol-pitch')[0];
    pith.deleteElement();
    clearGenerationCounter();
    const alpha = pith.shadow.getElementById('Alpha');
    pith.width = widthSize;
    pith.height = heightSize;
    pith.createElement(alpha);
}
let pauseClicked = false;
function startPauseButtonhandler() {
    if (playing && pauseClicked) {
        playing = false;
        clearTimeout(timer);
        pauseClicked = false;
    } else {
        playing = true;
        playGame();
    }
}
function pauseButtonHandler() {
    pauseClicked = true;
    startPauseButtonhandler();
}
function clearButtonhandler() {
    playing = false;
    clearTimeout(timer);
    resetGrid();
    updateView();
    clearGenerationCounter();
}
function clearGenerationCounter() {
    var gen = document.getElementById('idGenerationCounter');
    generationTime = 0;
    gen.innerHTML = '0';
}
window.customElements.define('cgol-pitch', CgolPitch);
window.onload = setUp;
