const DomElement = (function () {
  const menuBtn = document.querySelector('.burger_menu_btn ');
  const rightSection = document.querySelector('.right_section');
  const leftSection = document.querySelector('.left_section ');
  const board = document.querySelector('.game_board');
  const boardChildrenArr = Array.from(board.children);
  const gameStartingDialog = document.querySelector('.game_start_options');
  const GSD_twoPlayerOption = document.querySelector('.two_players');
  const startBtn = document.querySelector('#start');
  const leftSectionLog = document.querySelector('.score');
  const leftSectionLogDraw = document.querySelector('.score .draw');
  const leftSectionRound = document.querySelector('.round_nbr');
  const turns = document.querySelector('.turns');

  const GSD_playerVsComputerOption = document.querySelector('.player_vs_ai');
  const GSD_twoPlayerOption_inputs = document.querySelectorAll(
    '.two_players input'
  );
  const GSD_playerVsComputerOption_inputs = document.querySelectorAll(
    '.player_vs_ai input'
  );
  const roundEnded_dialog = document.querySelector('.roundEnded');

  return {
    menuBtn,
    rightSection,
    leftSection,
    board,
    boardChildrenArr,
    gameStartingDialog,
    GSD_twoPlayerOption,
    GSD_twoPlayerOption_inputs,
    GSD_playerVsComputerOption,
    GSD_playerVsComputerOption_inputs,
    startBtn,
    leftSectionLog,
    leftSectionLogDraw,
    turns,
    leftSectionRound,
    roundEnded_dialog,
  };
})();

const Player = function (Name, Mark) {
  const name = Name;
  const mark = Mark;
  const score = {
    won: 0,
    lost: 0,
  };

  const getName = () => {
    return name;
  };

  const getMark = () => {
    return mark;
  };

  const getScore = () => {
    return [score.won, score.lost];
  };

  const won = function (wonOrNot) {
    if (wonOrNot) {
      score.won++;
    } else {
      score.lost++;
    }
  };

  const select = () => {
    uiController.rightSectionController.removeActivePlayerMark(name);
  };

  return { getName, getMark, getScore, select, won };
};

const GameBoard = (function () {
  const _gameBoard = new Array(9);

  const _checkIfCellEmpty = (index) => {
    return !_gameBoard[index] ? true : false;
  };

  const _checkForRemainingEmptyCells = () => {
    if (!_gameBoard.includes(undefined)) {
      _endTheGame();
      GameLogic.endRound(undefined);
    }
  };

  const _endTheGame = () => {
    DomElement.board.removeEventListener('click', DomListener.gridCellClick);
    uiController.rightSectionController.removeActivePlayerMark();
  };

  const _checkForWinner = function () {
    const winningFormulas = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];
    let x_arr = [];
    let o_arr = [];

    //when the first player enter the 3rd mark start checking for a winner
    const resultArray = _gameBoard.filter((item) => item != undefined);
    if (resultArray.length >= 5) {
      //get indexes of each mark in separate array
      _gameBoard.forEach((item, index) => {
        if (item == 'x') {
          x_arr.push(index + 1);
        } else if (item == 'o') {
          o_arr.push(index + 1);
        }
      });

      //compare with the winning formula
      for (let index = 0; index < winningFormulas.length; index++) {
        const formula = winningFormulas[index];
        let x_result = formula.every((item) => x_arr.includes(item));
        let o_result = formula.every((item) => o_arr.includes(item));

        if (x_result || o_result) {
          _endTheGame();
          return true;
        }
      }
    }
  };

  const resetBoard = function () {
    _gameBoard.length = 0;
    _gameBoard.length = 9;
    uiController.rightSectionController.cleanGameBoard();
  };

  const fillCell = (index) => {
    let currPlayer;

    if (_checkIfCellEmpty(index)) {
      currPlayer = GameLogic.whoIsNext();
      const playerMark = currPlayer.getMark();

      _gameBoard[index] = playerMark;

      uiController.rightSectionController.renderGameBoard(_gameBoard);
    } else {
      uiController.rightSectionController.gameBoardError(index);
    }

    if (_checkForWinner()) {
      GameLogic.endRound(currPlayer);
    } else {
      _checkForRemainingEmptyCells();
    }
  };

  return { fillCell, resetBoard };
})();

const GameLogic = (function () {
  let player1, player2;
  let whoIsNextIndex = 0;
  let round = 1;
  let draw = 0;

  const startNewGame = function (gameType) {
    if (gameType === 'twoPlayers') {
      const player_1 = DomElement.GSD_twoPlayerOption_inputs[0].value
        ? DomElement.GSD_twoPlayerOption_inputs[0].value.trim()
        : 'Player 1';
      const player_2 = DomElement.GSD_twoPlayerOption_inputs[1].value
        ? DomElement.GSD_twoPlayerOption_inputs[1].value.trim()
        : 'Player 2';

      player1 = new Player(player_1, 'x');
      player2 = new Player(player_2, 'o');
    } else if (gameType === 'onePlayer') {
      const player_1 = DomElement.GSD_playerVsComputerOption_inputs[0].value
        ? DomElement.GSD_playerVsComputerOption_inputs[0].value
        : 'Player 1';
      const player_2 = 'computer';
      player1 = new Player(player_1, 'x');
      player2 = new Player(player_2, 'o');
    }

    uiController.leftSectionController.updateLogPlayerNames(
      player1.getName(),
      player2.getName()
    );
    uiController.rightSectionController.DisplayNameAndIcon(
      player1.getName(),
      player2.getName()
    );
    uiController.leftSectionController.updateLogRound(round);
    player1.select();
  };

  const whoIsNext = function () {
    const player = [player1, player2][whoIsNextIndex];
    whoIsNextIndex = whoIsNextIndex === 0 ? 1 : 0;
    [player1, player2][whoIsNextIndex].select();
    return player;
  };

  const newRound = function () {
    DomElement.roundEnded_dialog.style.display = 'none';
    uiController.leftSectionController.updateLogRound(round);
    GameBoard.resetBoard();
    DomElement.board.addEventListener('click', DomListener.gridCellClick);
    whoIsNextIndex = 0;
    player1.select();
  };

  const endRound = function (winner) {
    if (winner) {
      if (winner === player1) {
        player1.won(true);
        player2.won(false);
      } else {
        player1.won(false);
        player2.won(true);
      }

      uiController.leftSectionController.updateScore(
        player1.getScore(),
        player2.getScore()
      );
    } else {
      DomElement.leftSectionLogDraw.textContent = ++draw;
    }

    round++;
    DomElement.roundEnded_dialog.style.display = 'flex';
    uiController.rightSectionController.displayRoundEndDialog(winner);
  };

  return { startNewGame, endRound, newRound, whoIsNext };
})();

const uiController = (function () {
  let gameType = null;

  const startingDialogController = {
    toggleGameMode: function (target) {
      if (target.closest('.two_players')) {
        DomElement.GSD_twoPlayerOption.classList.add('selected');

        // enable name input to edit name and disable the opposite option name input
        DomElement.GSD_playerVsComputerOption.classList.remove('selected');
        DomElement.GSD_twoPlayerOption_inputs.forEach((input) => {
          input.disabled = false;
        });
        DomElement.GSD_playerVsComputerOption_inputs[0].disabled = true;

        DomElement.startBtn.disabled = false;
        gameType = 'twoPlayers';
      } else if (target.closest('.player_vs_ai')) {
        DomElement.GSD_playerVsComputerOption.classList.add('selected');
        DomElement.GSD_twoPlayerOption.classList.remove('selected');

        // enable name input to edit name and disable the opposite option name input
        DomElement.GSD_playerVsComputerOption_inputs[0].disabled = false;
        DomElement.GSD_twoPlayerOption_inputs.forEach((input) => {
          input.disabled = true;
        });

        DomElement.startBtn.disabled = false;
        gameType = 'onePlayer';
      }
    },
    startOrExitGame: function (target) {
      if (target.id === 'start') {
        if (
          DomElement.GSD_twoPlayerOption_inputs[0].value !=
            DomElement.GSD_twoPlayerOption_inputs[1].value ||
          DomElement.GSD_twoPlayerOption_inputs[0].value == ''
        ) {
          DomElement.gameStartingDialog.style.display = 'none';
          DomElement.rightSection.style.display = 'flex';
          DomElement.leftSection.style.display = 'flex';
          GameLogic.startNewGame(gameType);
        } else {
          setTimeout(() => {
            target.classList.remove('shake-horizontal');
          }, 300);
          document.querySelector('.same-name-err').style.display =
            'inline-block';
          target.classList.add('shake-horizontal');
        }
      } else if (target.id === 'exit') {
        if (window.confirm('do you want to exit ?')) {
          window.close();
        }
      }
    },
  };

  const leftSectionController = {
    showHideMenu: function () {
      DomElement.menuBtn.classList.toggle('show');
      if (DomElement.menuBtn.classList.contains('show')) {
        DomElement.leftSection.style.transform = 'translateX(0)';
        DomElement.menuBtn.style.right = '0';
        DomElement.menuBtn.classList.remove('menu-btn-for-md');
        DomElement.rightSection.classList.remove('center');
        setTimeout(() => {
          DomElement.menuBtn.classList.add('close');
        }, 250);
      } else {
        DomElement.leftSection.style.transform = 'translateX(-100%)';
        DomElement.menuBtn.style.right = '-3.5rem';
        DomElement.menuBtn.classList.add('menu-btn-for-md');
        DomElement.rightSection.classList.add('center');
        setTimeout(() => {
          DomElement.menuBtn.classList.remove('close');
        }, 250);
      }
    },
    updateLogPlayerNames: function (player1, player2) {
      [...DomElement.leftSectionLog.children].forEach((item, index) => {
        if (['Player1', 'Player2'].includes(item.className)) {
          switch (item.className) {
            case 'Player1':
              item.textContent = player1;
              break;
            case 'Player2':
              item.textContent = player2;
              break;
            default:
              break;
          }
        }
      });
    },
    updateScore: function (player1Score, player2Score) {
      [...DomElement.leftSectionLog.children].forEach((item) => {
        if (
          ['p1w', 'p1l', 'p1d', 'p2w', 'p2l', 'p2d'].includes(item.className)
        ) {
          switch (item.className) {
            case 'p1w':
              item.textContent = player1Score[0];
              break;
            case 'p1l':
              item.textContent = player1Score[1];
              break;
            case 'p2w':
              item.textContent = player2Score[0];
              break;
            case 'p2l':
              item.textContent = player2Score[1];
              break;
            default:
              break;
          }
        }
      });
    },
    updateLogRound: function (round) {
      [...DomElement.leftSectionRound.children][1].textContent = round;
    },
  };

  const rightSectionController = {
    cleanGameBoard: function () {
      DomElement.boardChildrenArr.forEach((element) => {
        element.classList.remove('js-x', 'js-o');
      });
    },
    renderGameBoard: function (dataArray) {
      DomElement.boardChildrenArr.forEach((element, index) => {
        if (dataArray[index]) {
          element.classList.add(`js-${dataArray[index]}`);
        }
      });
    },
    gameBoardError: function (cellIndex) {
      const timer = setTimeout(() => {
        DomElement.boardChildrenArr[cellIndex].classList.remove(`err`);
      }, 200);

      DomElement.boardChildrenArr[cellIndex].classList.add('err');
    },
    DisplayNameAndIcon: function (player1, player2) {
      let counter = 0;
      [...DomElement.turns.children].forEach((child) => {
        [...child.children][1].textContent = [player1, player2][counter];
        counter++;
      });

      // add computer icon
      if (player2.toLowerCase() === 'computer') {
        [...[...DomElement.turns.children][1].children][0].classList.add(
          'computer'
        );
      }
    },
    removeActivePlayerMark: (exception) => {
      [...DomElement.turns.children].forEach((player) => {
        player.classList.remove('active');

        if ([...player.children][1].textContent === exception) {
          player.classList.add('active');
        }
      });
    },

    displayRoundEndDialog: function (winner) {
      DomElement.roundEnded_dialog.style.display = 'flex';
      [...[...DomElement.roundEnded_dialog.children][0].children].forEach(
        (item) => {
          if (item.tagName === 'H1') {
            item.textContent = winner
              ? `${winner.getName()} Won this Round`
              : 'DRAW';
          }
        }
      );
    },
  };

  return {
    startingDialogController,
    leftSectionController,
    rightSectionController,
  };
})();

const DomListener = (function () {
  const startExitGame = (e) => {
    e.stopPropagation();
    if (e.target.closest('.card')) {
      uiController.startingDialogController.toggleGameMode(e.target);
    } else if (e.target.closest('.controls')) {
      uiController.startingDialogController.startOrExitGame(e.target);
    }
  };

  const showHideMenu = (e) => {
    e.stopPropagation();
    uiController.leftSectionController.showHideMenu();
  };

  const gridCellClick = (e) => {
    if (e.target.closest('.board_column')) {
      e.stopPropagation();
      const clicked_column = e.target.closest('.board_column');
      const cellIndex = Array.from(DomElement.board.children).indexOf(
        clicked_column
      );

      GameBoard.fillCell(cellIndex);
    }
  };

  const roundEnded_dialogClick = function (e) {
    if (e.target.id === 'newRound') {
      GameLogic.newRound();
    } else if (e.target.id === 'newGame') {
      location.reload();
    }
  };

  return { gridCellClick, showHideMenu, startExitGame, roundEnded_dialogClick };
})();

const DomEvent = (function () {
  DomElement.gameStartingDialog.addEventListener(
    'click',
    DomListener.startExitGame
  );

  // show/hide the side menu and change the menu icon accordingly
  DomElement.menuBtn.addEventListener('click', DomListener.showHideMenu);

  // fill board column with players mark when clicked
  DomElement.board.addEventListener('click', DomListener.gridCellClick);

  DomElement.roundEnded_dialog.addEventListener(
    'click',
    DomListener.roundEnded_dialogClick
  );
})();
