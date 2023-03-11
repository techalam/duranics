/*vanilla-tilt.js*/
const tilt = document.querySelectorAll(".tilt");

VanillaTilt.init(tilt, {
	reverse: true,
	max: 15,
	speed: 400,
	scale: 1.12,
	glare: true,
	reset: true,
	perspective: 500,
	transition: true,
	"max-glare": 0.75,
	"glare-prerender": false,
	gyroscope: true,
	gyroscopeMinAngleX: -45,
	gyroscopeMaxAngleX: 45,
	gyroscopeMinAngleY: -45,
	gyroscopeMaxAngleY: 45
});


function sorting(){
	var sorting = document.getElementById('sort');
if(sorting.style.display == "block"){
	sorting.style.display = "none";
}
else{
	sorting.style.display = "block";
}
	}

function showFilters() {
    // debugger;
    var listbg = document.getElementById("filterbg");
    var listfilter = document.getElementById("filterContain");
    listbg.classList.toggle("mystyle");
    listfilter.classList.toggle("mystyle2");
}


    var carousel = setInterval(() => {
        document.getElementById('nextSlide').click();
    }, 3000);


let slideIndex = 1;
showSlide(slideIndex);

function prevSlide() {
  showSlide(slideIndex -= 1);
}

function nextSlide() {
  showSlide(slideIndex += 1);
  clearInterval(carousel);
}

function showSlide(n) {
  let slides = document.getElementsByClassName("slideshow-slide");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slides[slideIndex - 1].classList.add("active");
}




