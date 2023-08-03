window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

let counts = {};
let selections = {};

let images = ['https://media.giphy.com/media/fSHgyXYXy8Sd2/giphy.gif', 'https://i.stack.imgur.com/SBv4T.gif', 'https://media.giphy.com/media/wyoUdfhunrDZ6/giphy.gif', 
'https://media.giphy.com/media/14uXQbPS73Y3qU/giphy.gif', 
'https://media.giphy.com/media/SzLfW8ydkkjde/giphy.gif', 
'https://media.giphy.com/media/ruhPcuDNmS12M/giphy.gif', 
'https://media.giphy.com/media/BjKPq7zcAiNgf0zfXc/giphy.gif', 
'https://media.giphy.com/media/33zX3zllJBGY8/giphy.gif', 
'images/9.jpg',];

function createGrids() {
    let numGrids = document.getElementById('grid-select').value;
    let container = document.getElementById('grid-container');
    container.innerHTML = '';

    for(let i = 0; i < numGrids; i++) {
        let grid = document.createElement('div');
        grid.className = 'grid';
        grid.id = 'grid-' + i;

        counts[i] = {good: 0, bad: 0}; // Initialize counts for this grid
        selections[i] = {}; // Initialize selections for this grid

        for(let j = 0; j < 9; j++) {
            let item = document.createElement('div');
            item.className = 'grid-item';
            item.id = 'grid-' + i + '-item-' + j;

            let img = document.createElement('img');
            img.src = images[j];
            item.appendChild(img);

            item.onmousedown = function(event) { clickItem(item, i, event); };
            grid.appendChild(item);
        }

        container.appendChild(grid);
    }
}



function clickItem(item, gridNum, event) {
    let type;
    let img = item.querySelector('img'); // get the img element inside the grid item
    // Right click (button code 2)
    if(event.button === 2) {
        if(img.classList.contains('bad')) {
            img.classList.remove('bad');
            counts[gridNum].bad--;
            selections[gridNum][item.id] = undefined;
        } else if(counts[gridNum].bad < 1) {
            img.classList.add('bad');
            counts[gridNum].bad++;
            type = 'bad';
        }
    } 
    // Left click (button code 0)
    else if(event.button === 0) {
        if(img.classList.contains('good')) {
            img.classList.remove('good');
            counts[gridNum].good--;
            selections[gridNum][item.id] = undefined;
        } else if(counts[gridNum].good < 3) {
            img.classList.add('good');
            counts[gridNum].good++;
            type = 'good';
        }
    }

    if (type) {
        // Remove other class if present
        img.classList.remove(type === 'good' ? 'bad' : 'good');
        selections[gridNum][item.id] = type;
    }
}



function storeData() {
    let uniqueTitle = "StoreOp" + Date.now();
    Object.keys(selections).forEach(gridNum => {
        Object.keys(selections[gridNum]).forEach(itemId => {
            let type = selections[gridNum][itemId];
            if(type) {
                // Store both grid ID and type in the database
                updateGrid(uniqueTitle, gridNum, itemId, type, '1');
            }
        });
    });
}


// ...updateGrid function as before...



function updateGrid(title, gridNum, itemId, type) {
    fetch('http://localhost:3000/update-grid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            gridId: gridNum,
            itemId: itemId,
            type: type
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

