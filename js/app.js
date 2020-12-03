const menuBtn = document.querySelector('.burger_menu_btn ');
const marks = document.querySelector('.marks');

menuBtn.addEventListener('click', (e) => {
  menuBtn.classList.toggle('show');
  const rightSection = document.querySelector('.right_section');
  const leftSection = document.querySelector('.left_section ');

  if (menuBtn.classList.contains('show')) {
    leftSection.style.transform = 'translateX(0)';
    menuBtn.style.right = '0';
    rightSection.classList.remove('center');
    setTimeout(() => {
      menuBtn.classList.add('close');
    }, 250);
  } else {
    leftSection.style.transform = 'translateX(-100%)';
    menuBtn.style.right = '-5rem';
    rightSection.classList.add('center');
    setTimeout(() => {
      menuBtn.classList.remove('close');
    }, 250);
  }
});
