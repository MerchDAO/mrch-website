'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu
  {
    class Menu {
      constructor(options = {}) {
        const {
          hamburgerButton = '.HamburgerButton',
          navigationList = '.NavigationList'
        } = options;

        this.hamburgerButton = hamburgerButton;
        this.navigationList = navigationList;
        this.init();
      }
      init() {
        const button = document.querySelectorAll(this.hamburgerButton);
        const menu = document.querySelector(this.navigationList);
        button.forEach(element => {
          element.addEventListener('click', () => {
            let expanded = element.getAttribute('aria-expanded');

            (expanded === 'false') ?
            element.setAttribute('aria-expanded', true) :
            element.setAttribute('aria-expanded', false);

            menu.classList.toggle('active');

            window.addEventListener('click', event => {
              if(!event.target.closest(this.hamburgerButton) &&
                 !event.target.closest(this.hamburgerButton)) {
                menu.classList.remove('active');

                (expanded === 'false') ?
                element.setAttribute('aria-expanded', true) :
                element.setAttribute('aria-expanded', false);
              }
            });
          });
        })


      }
    }
    new Menu();
  }

  // Scroll Header
  {
    const header = document.querySelector('.page-header');

    window.addEventListener('scroll', function(e) {
      const scrollPosition = window.scrollY;

      if (scrollPosition >= 100) {
        header.classList.add('scroll');
      } else {
        header.classList.remove('scroll');
      }
    });
  }

  // Accordion
  {
    class Accordion {
      constructor(options = {}) {
        const {
          accordion = '.accordionItem',
          accordionContents = '.accordionContent',
          closeOther = true,
        } = options;
        this.accordion = accordion;
        this.accordionContents = accordionContents;
        this.closeOther = closeOther;
        this.init();
      }
      init() {
        const accordion = document.querySelectorAll(this.accordion);
        const accordionContents = document.querySelectorAll(this.accordionContents);

        accordion.forEach((element, index, array) => {
          element.addEventListener('click', () => {
            const accordionContentItem = document.querySelector(`${element.dataset.target}`);
            if(this.closeOther) {
              if(!element.classList.contains('active')) {
                for(let accordionItems of array) {
                  accordionItems.classList.remove('active');
                  accordionItems.attributes['aria-selected'].value = false;
                }
                for(let accordionContentItems of accordionContents) {
                  accordionContentItems.classList.remove('active');
                  accordionContentItems.attributes['aria-selected'].value = false;
                }
              }
            }
            element.classList.toggle('active');
            if(element.classList.contains('active')) {
              element.attributes['aria-selected'].value = true;
            } else {
              element.attributes['aria-selected'].value = false;
            }
            if(accordionContentItem) {
              accordionContentItem.classList.toggle('active');
              accordionContentItem.attributes['aria-selected'].value = true;
            }
          })
        });
      }
    }
    new Accordion();
  }

  // Tooltip
  {
    const tooltiBtn = document.querySelectorAll('.tooltipBtn');
    tooltiBtn.forEach((element, index, array) => {
      element.addEventListener('click', (event) => {
        if(!element.parentElement.classList.contains('tooltip--open')) {
          for(let item of array) {
            item.parentElement.classList.remove('tooltip--open')
          }
        }
        element.parentElement.classList.toggle('tooltip--open');
      });
      window.addEventListener('click', event => {
        if(!event.target.closest('.tooltip')) {
          element.parentElement.classList.remove('tooltip--open');
        }
      });
    });
  }


  // Video
  {
    class LazyVideoYt {
      constructor(options = {}) {
        const {
          videoEl = '.LazyVideoYt',
        } = options;
        this.videoEl = videoEl;
        this.init();
      }
      init() {
        const videoEl = document.querySelectorAll(this.videoEl);

        videoEl.forEach((element, index, array) => {
          const videoUrl = `https://www.youtube.com/embed/${element.dataset.id}/?autoplay=1&${element.dataset.params}`;
          const imgUrl = `https://img.youtube.com/vi/${element.dataset.id}/maxresdefault.jpg`;
          const imgAlt = element.dataset.alt;
          const createIframe = function() {
            for (let items of array) {
              if (items.lastElementChild.tagName === 'IFRAME') {
                items.lastElementChild.remove();
              }
            }
            this.innerHTML +=
            `<iframe
              class="video__iframe"
              frameborder="0"
              src="${videoUrl}"
              width="100%"
              height="100%"
              allowfullscreen="allowfullscreen">
            </iframe>`;
          };

          if(element.firstElementChild.tagName === 'IMG') {
            element.addEventListener('click', createIframe);
          } else {
            element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="${imgAlt}">`;
            element.addEventListener('click', createIframe);
          }
        });

      }
    }
    new LazyVideoYt();
  }
  // Cookies
  {
    const cookiesModal = document.querySelector('.cookies');
    const rejectCookies = document.querySelector('.rejectCookies');
    const acceptCookies = document.querySelector('.acceptCookies');

    rejectCookies.addEventListener('click', () => {
      cookiesModal.classList.remove('cookies--open');
    });
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesModalClosed', true);
      cookiesModal.classList.remove('cookies--open');
    });

    if (localStorage.getItem('cookiesModalClosed') === null) {
      cookiesModal.classList.add('cookies--open')
    }
  }

  // Subscribe
  {
    const thankyouModal = document.querySelector('.thankyou');
    const thankyouOpen = document.querySelector('.thankyouOpen');

    if(thankyouOpen) {
      thankyouOpen.addEventListener('click', () => {
        thankyouModal.classList.add('thankyou--open');
      });
      thankyouModal.addEventListener('click', event => {
        const target = event.target;

        if(target.closest('.thankyouClose') || target.closest('.thankyou') && !target.closest('.thankyou__content')) {
          thankyouModal.classList.remove('thankyou--open');
        }
      })
    }

  }
  // Inits
  {
    var reviewsSlider = new Swiper(".reviewsSlider", {
      spaceBetween: 24,
      loop: true,
      pagination: {
        el: ".reviewsSlider .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        992: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 2,
        },
        320: {
          slidesPerView: 1,
        },
      }
    });
    var merchSlider = new Swiper(".merchSlider", {
      spaceBetween: 42,
      slidesPerView: 'auto',
      loop: true,
    });
    var ASocialSlider = new Swiper(".ASocialSlider", {
      spaceBetween: 34,
      slidesPerView: 'auto',
      pagination: {
        el: ".ASocialSlider .swiper-pagination",
        clickable: true,
      },
    });
  }

});
