
// Function to toggle dark mode and moon image
function toggleDarkMode() {
	const body = document.body;
	const moonImage = document.querySelector('#dark-mode-toggle img');
  
	// Check if dark mode is currently active using media query
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
	if (isDarkMode) {
	  // Apply light mode styles (remove any dark mode overrides)
	  moonImage.src = './assets/images/moon.png'; // Change to full moon image
	} else {
	  // Apply dark mode overrides
	  moonImage.src = './assets/images/crescent-moon-phase.png'; // Change to crescent moon image
	}
  }



//   modal popup script 

  let moonbutton = document.querySelector('.profile');
moonbutton.onclick = () => {
	// e.keyCode === 13
	document.documentElement.classList.toggle('dark-mode');
	// document.querySelectorAll('.inverted').forEach((result) => {
	// })
}

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

closeBtn.addEventListener("click", function () {
	myModal.style.display = "none";
});

window.addEventListener("click", function (event) {
	if (event.target == myModal) {
		myModal.style.display = "none";
	}
});
