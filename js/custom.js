const openEls = document.querySelectorAll("[data-open]");
const closeEls = document.querySelectorAll("[data-close]");
const isVisible = "is-visible";

for (const el of openEls) {
  el.addEventListener("click", function() {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}

for (const el of closeEls) {
  el.addEventListener("click", function() {
    this.parentElement.parentElement.parentElement.classList.remove(isVisible);
  });
}

document.addEventListener("click", e => {
  if (e.target == document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});

document.addEventListener("keyup", e => {
  // if we press the ESC
  if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});

function remove(){
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
}

function remMod1(){
    
    document.querySelector(".mod1").classList.remove("invisible");
    document.querySelector(".mod2").classList.remove("d-none");
    document.querySelector(".mod3").classList.remove("d-none"); 
    document.querySelector(".rem2").classList.add("d-none");
    document.querySelector(".rem3").classList.add("d-none");     
    
}

function remMod2(){
    
    document.querySelector(".mod1").classList.add("invisible");
    document.querySelector(".mod2").classList.add("d-none");
    document.querySelector(".mod3").classList.add("d-none"); 
    document.querySelector(".rem2").classList.remove("d-none");
    document.querySelector(".rem3").classList.remove("d-none");
    
}