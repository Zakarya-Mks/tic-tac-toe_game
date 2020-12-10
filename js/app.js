const DomElement = (function () {
  const menuBtn = document.querySelector('.burger_menu_btn ');
  const marks = document.querySelector('.marks');
  const rightSection = document.querySelector('.right_section');
  const leftSection = document.querySelector('.left_section ');
  const mark_x = document.querySelector('.x');
  const mark_o = document.querySelector('.o');
  const board = document.querySelector('.game_board');
  const boardChildrenArr = Array.from(board.children);
  const gameStartingDialog = document.querySelector('.game_start_options');
  const GSD_twoPlayerOption = document.querySelector('.two_players');
  const startBtn = document.querySelector('#start');
  const leftSectionLog = document.querySelector('.score');
  const leftSectionRound = document.querySelector('.round_nbr');
  const turns = document.querySelector('.turns');

  const GSD_playerVsComputerOption = document.querySelector('.player_vs_ai');
  const GSD_twoPlayerOption_inputs = document.querySelectorAll(
    '.two_players input'
  );
  const GSD_playerVsComputerOption_inputs = document.querySelectorAll(
    '.player_vs_ai input'
  );

  return {
    menuBtn,
    marks,
    rightSection,
    leftSection,
    mark_x,
    mark_o,
    board,
    boardChildrenArr,
    gameStartingDialog,
    GSD_twoPlayerOption,
    GSD_twoPlayerOption_inputs,
    GSD_playerVsComputerOption,
    GSD_playerVsComputerOption_inputs,
    startBtn,
    leftSectionLog,
    turns,
    leftSectionRound,
  };
})();

const Player = function (Name, Mark) {
  const name = Name;
  const mark = Mark;
  const wonRound = [];
  const lostRounds = [];
  let score = 0;

  const getName = () => {
    return name;
  };

  const changeMark = (newMark) => {
    mark = newMark;
  };

  return { getName, changeMark };
};

const GameBoard = (function () {
  const _gameBoard = new Array(9);

  const _checkForEmptySpot = (index) => {
    return !_gameBoard[index] ? true : false;
  };

  const add = (mark, index) => {
    if (index < 9 && ['x', 'o'].includes(mark)) {
      if (_checkForEmptySpot(index)) {
        _gameBoard[index] = mark;

        uiController.rightSectionController.renderGameBoard(_gameBoard);
      } else {
        uiController.rightSectionController.gameBoardError(index);
      }
    }
  };

  return { add };
})();

const GameLogic = (function () {
  let round = 1;
  let player1, player2;
  const setNewGame = function (gameType) {
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
    uiController.rightSectionController.turnsUpdate(
      player1.getName(),
      player2.getName()
    );
    uiController.leftSectionController.updateLogRound(round);
  };

  return { setNewGame };
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
        DomElement.gameStartingDialog.style.display = 'none';
        DomElement.rightSection.style.display = 'flex';
        DomElement.leftSection.style.display = 'flex';
        GameLogic.setNewGame(gameType);
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
        DomElement.rightSection.classList.remove('center');
        setTimeout(() => {
          DomElement.menuBtn.classList.add('close');
        }, 250);
      } else {
        DomElement.leftSection.style.transform = 'translateX(-100%)';
        DomElement.menuBtn.style.right = '-5rem';
        DomElement.rightSection.classList.add('center');
        setTimeout(() => {
          DomElement.menuBtn.classList.remove('close');
        }, 250);
      }
    },
    selectPlayerMark: function (target) {
      if (target.closest('.x')) {
        DomElement.mark_x.classList.add('selected');
        DomElement.mark_o.classList.remove('selected');
      } else if (target.closest('.o')) {
        DomElement.mark_o.classList.add('selected');
        DomElement.mark_x.classList.remove('selected');
      }
    },
    updateLogPlayerNames: function (player1, player2) {
      let counter = 0;
      [...DomElement.leftSectionLog.children].forEach((child, index) => {
        if (child.nodeName === 'DIV') {
          [...child.children][0].textContent =
            [player1, player2][counter] + ':';
          counter++;
        }
      });
    },
    updateLogRound: function (round) {
      [...DomElement.leftSectionRound.children][1].textContent = round;
    },
  };

  const rightSectionController = {
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
    turnsUpdate: function (player1, player2) {
      let counter = 0;
      [...DomElement.turns.children].forEach((child, index) => {
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
  };

  return {
    startingDialogController,
    leftSectionController,
    rightSectionController,
  };
})();

const DomEventListeners = (function () {
  DomElement.gameStartingDialog.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target.closest('.card')) {
      uiController.startingDialogController.toggleGameMode(e.target);
    } else if (e.target.closest('.controls')) {
      uiController.startingDialogController.startOrExitGame(e.target);
    }
  });

  // show/hide the side menu and change the menu icon accordingly
  DomElement.menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    uiController.leftSectionController.showHideMenu();
  });

  //select player marks in the side menu
  DomElement.marks.addEventListener('click', (e) => {
    e.stopPropagation();
    uiController.leftSectionController.selectPlayerMark(e.target);
  });

  // fill board column with players mark when clicked
  DomElement.board.addEventListener('click', (e) => {
    if (e.target.closest('.board_column')) {
      const mark = document.querySelector('.marks .selected').classList[0];
      const clicked_column = e.target.closest('.board_column');
      const gameBoard = Array.from(DomElement.board.children);

      GameBoard.add(mark, gameBoard.indexOf(clicked_column));
    }
  });
})();
