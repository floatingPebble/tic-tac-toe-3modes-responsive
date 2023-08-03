const singleField = document.querySelectorAll('.single-field');
const msgBoard = document.querySelector('.msg-board');
const btns = document.querySelectorAll('.play-btn');
const onTurn = document.querySelector('.on-turn');

let gameOver = false;
let gameMode = 'none';
let moveCount = 0;
let compInterval;
const player1 = {
    sign: 'X',
    name: 'Player1',
    combos: {
        ver1: 0,
        ver2: 0,
        ver3: 0,
        hor1: 0,
        hor2: 0,
        hor3: 0,
        dia1: 0,
        dia2: 0
    }
};

const player2 = {
    sign: 'O',
    name: 'Player2',
    combos: {
        ver1: 0,
        ver2: 0,
        ver3: 0,
        hor1: 0,
        hor2: 0,
        hor3: 0,
        dia1: 0,
        dia2: 0
    }
};

let activePlayer = player1;
let passivePlayer = player2;

function chooseMode(mode) {
    btns.forEach(btn => {
        btn.classList.add('hidden');
    });

    restart();

    gameMode = mode;
    activePlayer = player1;
    passivePlayer = player2;
    onTurn.innerHTML = activePlayer.name;
    if (mode === 'pvc') {
        player1.name = 'Player';
        player2.name = 'Computer';
    } else if (mode === 'pvp') {
        player1.name = 'Player 1';
        player2.name = 'Player 2';
    } else {
        player1.name = 'Computer 1';
        player2.name = 'Computer 2';
        compMatch();
    }
}

function compMatch() {
    compInterval = setInterval(() => {
        compMove(activePlayer);
        if (gameOver) {
            clearInterval(compInterval);
        }
    }, 1000);
}

function restart() {
    msgBoard.innerHTML = '';
    gameOver = false;
    moveCount = 0;

    singleField.forEach(f => {
        f.innerHTML = '';
        if (f.classList.contains('green')) {
            f.classList.remove('green');
        }
    });

    for (let combo in player1.combos) {
        player1.combos[combo] = 0;
    }
    for (let combo in player2.combos) {
        player2.combos[combo] = 0;
    }
}

function compMove(activePlayer) {
    let field;
    let priority = 0;
    for (const combo in activePlayer.combos) {

        if (activePlayer.combos[combo] === 2) {
            singleField.forEach(f => {
                if (f.classList.contains(combo) && f.innerHTML === '') {
                    field = f;
                    priority = 3;
                }
            })
        } else if (passivePlayer.combos[combo] === 2 && priority < 3) {
            singleField.forEach(f => {
                if (f.classList.contains(combo) && f.innerHTML === '') {
                    field = f;
                    priority = 2;
                }
            })
        } else if (!field && priority < 2) {
            let emptyFields = [];
            singleField.forEach(f => {
                if (f.innerHTML === '') {
                    emptyFields.push(f);
                }
            });
            let randomNum = Math.floor(Math.random() * emptyFields.length);
            field = emptyFields[randomNum];
        }
    }
    move(activePlayer, field);
}

let playerMove = () => {
    singleField.forEach(field => {
        field.addEventListener('click', () => {
            if (moveCount === 8 && activePlayer.name !== 'Computer') {
                move(activePlayer, field);
            } else if (field.innerHTML === '' && !gameOver && gameMode !== 'none' && activePlayer.name !== 'Computer') {
                move(activePlayer, field);
                if (!gameOver && gameMode === 'pvc') {
                    compInterval = setInterval(() => {
                        compMove(activePlayer);
                        if (activePlayer.name !== 'Computer') {
                            clearInterval(compInterval);
                        }
                    }, 1000);
                } else if (!gameOver && gameMode === 'pvp') {
                    playerMove();
                }
            }
        })
    });
}

playerMove();

function move(player, field) {
    gameOver = moveCount > 8 ? true : false;
    if (field.innerHTML === '' && !gameOver) {
        field.innerHTML = player.sign;
        moveCount++;
        field.classList.forEach(el => {
            if (el !== 'single-field') {
                player.combos[el]++;
                if (player.combos[el] > 2) {
                    msgBoard.innerHTML = `${player.name} wins!`;
                    btns.forEach(btn => {
                        btn.classList.remove('hidden');
                    });
                    gameOver = true;
                    singleField.forEach(f => {
                        if (f.classList.contains(el)) {
                            f.classList.add('green');
                        }
                    });
                }
            }
        });
    }
    if (!gameOver && moveCount > 8) {
        msgBoard.innerHTML = `Draw!`;
        gameOver = true;
        btns.forEach(btn => {
            btn.classList.remove('hidden');
        });
    }
    activePlayer = activePlayer === player1 ? player2 : player1;
    passivePlayer = passivePlayer === player1 ? player2 : player1;
    onTurn.innerHTML = activePlayer.name;
}