const DomElement = (function () {
  const menuBtn = document.querySelector('.burger_menu_btn ');
  const marks = document.querySelector('.marks');
  const rightSection = document.querySelector('.right_section');
  const leftSection = document.querySelector('.left_section ');
  const mark_x = document.querySelector('.x');
  const mark_o = document.querySelector('.o');
  const board = document.querySelector('.game_board');
  const boardChildrenArr = Array.from(board.children);

  return {
    menuBtn,
    marks,
    rightSection,
    leftSection,
    mark_x,
    mark_o,
    board,
    boardChildrenArr,
  };
})();

const Player = function (Name, Mark) {
  const name = Name;
  const mark = Mark;
  let score = 0;

  return {};
};

const GameBoard = (function () {
  const _gameBoard = new Array(9);

  const _render = () => {
    DomElement.boardChildrenArr.forEach((element, index) => {
      if (_gameBoard[index]) {
        element.classList.add(`js-${_gameBoard[index]}`);
      }
    });
  };

  const _checkForEmptySpot = (index) => {
    return !_gameBoard[index] ? true : false;
  };

  const _throwErr = (index) => {
    const timer = setTimeout(() => {
      DomElement.boardChildrenArr[index].classList.remove(`err`);
    }, 200);

    DomElement.boardChildrenArr[index].classList.add('err');
  };

  const add = (mark, index) => {
    if (index < 9 && ['x', 'o'].includes(mark)) {
      if (_checkForEmptySpot(index)) {
        _gameBoard[index] = mark;
        _render();
      } else {
        _throwErr(index);
      }
    }
  };

  return { add };
})();

const GameLogic = (function () {
  return {};
})();

const DomEventListeners = (function () {
  // show/hide the side menu and change the menu icon accordingly
  DomElement.menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
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
  });

  //select player marks in the side menu
  DomElement.marks.addEventListener('click', (e) => {
    e.stopPropagation();

    if (e.target.closest('.x')) {
      DomElement.mark_x.classList.add('selected');
      DomElement.mark_o.classList.remove('selected');
    } else if (e.target.closest('.o')) {
      DomElement.mark_o.classList.add('selected');
      DomElement.mark_x.classList.remove('selected');
    }
  });

  // fill board column with players mark when clicked
  DomElement.board.addEventListener('click', (e) => {
    const mark = document.querySelector('.selected').classList[0];
    const clicked_column = e.target.closest('.board_column');
    const gameBoard = Array.from(DomElement.board.children);

    if (clicked_column) {
      GameBoard.add(mark, gameBoard.indexOf(clicked_column));
    }
  });
})();
