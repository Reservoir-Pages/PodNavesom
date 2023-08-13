const btnBlocks = document.querySelectorAll(".btn-block");
btnBlocks.forEach(btnBlock => {
  const btns = btnBlock.querySelectorAll('.btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(btn => {
        btn.classList.remove('btn--active');
      });
      btn.classList.add('btn--active');
    });
  });
});
