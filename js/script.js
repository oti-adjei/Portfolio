//Making variables and assigning html classes to it so as to use it

const header = document.querySelector("header");


//This function is to check if the scroll is greater than 0, 
// if yes let the header be sticky and the x button and navlist should not show whles scrolling
// window.scroll is a property that represents the number of pixels that the document has been scrolled vertically. 
window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 0);
	menu.classList.remove('bx-x');
	navlist.classList.remove('active');
});

//Making variables and assigning html classes to it so as to use it

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');


//  This function is to check if the menu icon button on smaller screen is pressed 
// if pressed it  should chage to the x button
menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navlist.classList.toggle('active');
};

//animation function using scrol reveal framework
const sr = ScrollReveal({
	distance: '45px',
	duration: 2700,
	reset: true
})

sr.reveal('.home-text', { delay: 350, origin: 'left' })
sr.reveal('.home-img', { delay: 350, origin: 'right' })

sr.reveal('.sub-service,.about,.portfolio,.service,.cta,.contact', { delay: 200, origin: 'bottom' })

let moonbutton = document.querySelector('.profile');
moonbutton.onclick = () => {
	// e.keyCode === 13
	document.documentElement.classList.toggle('dark-mode');
	// document.querySelectorAll('.inverted').forEach((result) => {
	// })
}
// document.onkeypress = function (e) {
// 	e = e || window.event;

// 	if (moonbutton.onclick) {
// 		e.keyCode === 13
// 		document.documentElement.classList.toggle('dark-mode');


// 		document.querySelectorAll('.inverted').forEach((result) => {

// 		})


// 	}
// }

const openModalBtn = document.getElementById("openModalBtn");
const myModal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("closeBtn")[0];

openModalBtn.onclick = () => {
	myModal.style.display = "block";
};
//if i use event listener the moonbutton will excute since i used used eventlistner but since i used on click rather it will override.
// openModalBtn.addEventListener("click", function() {
// 	myModal.style.display = "block";
// });

closeBtn.addEventListener("click", function() {
  myModal.style.display = "none";
});

window.addEventListener("click", function(event) {
  if (event.target == myModal) {
    myModal.style.display = "none";
  }
});

