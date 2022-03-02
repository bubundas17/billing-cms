(function () {
  'use strict';

  const sideNav = document.querySelector('.side-nav');
  // const mainContent = document.querySelector('.main-content');
  const menuButton = document.querySelector('.header__menu-button');
  const backdrops = document.querySelector('.backdrops');

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      sideNav.style.display = 'block';
      backdrops.style.display = 'none';
    } else {
      sideNav.style.display = 'none';
      backdrops.style.display = 'none';
    }
  });

  menuButton.addEventListener('click', () => {
    sideNav.style.display = 'block';
    backdrops.style.display = 'block';
  });

  backdrops.addEventListener('click', () => {
    sideNav.style.display = 'none';
    backdrops.style.display = 'none';
  });

  const forms = document.querySelectorAll('.needs-validation');

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false,
    );
  });
})();
