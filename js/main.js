import * as THREE from 'three';
import { LoadGLTFByPath } from '../js/helpers/ModelHelper.js'
import PositionAlongPathState from '../js/positionAlongPathTools/PositionAlongPathState.js';
import { handleScroll, updatePosition } from '../js/positionAlongPathTools/PositionAlongPathMethods.js'
import { loadCurveFromJSON } from '../js/curveTools/CurveMethods.js'
import { setupRenderer } from '../js/helpers/RendererHelper.js'

//Open/Close Menu On Click
let menuState = 0; //0 = Closed

document.getElementById("hamburger").addEventListener("click", menuToggle);

function menuToggle() {
  console.log("X Clicked");
  var x = document.getElementById("box-nav-menu");
  if (menuState == 0) {
    x.classList.remove("box-nav-close");
    x.classList.add("box-nav"); 
    menuState = 1; //Menu Is Now Open
  } else {
    x.classList.remove("box-nav");
    x.classList.add("box-nav-close");
    menuState = 0; //Menu Is Now Closed
  }
}






//GSAP and SplitType

const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Change to false to make the animations play when the section's in viewport
const scrub = true;
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)

  if(isAnimationOk) {
    setupAnimations();
}})

function setupAnimations() {

const splitTypes = document.querySelectorAll('.reveal-type')

splitTypes.forEach((char,i) => {

    const text = new SplitType(char,{ types: 'words, chars'})

    gsap.from(text.words, {
       scrollTrigger: {
           trigger: char,
           start: 'bottom 90%',
           end: 'bottom 85%',
           scrub: false,
           markers: false,
           toggleActions: 'play play reverse reverse'
       },
       stagger: 0.05,
       opacity: 0,
       y:90,
       transformOrigin: 'bottom',
       duration: 0.3,
    })
})



gsap.from(".line", {
  scrollTrigger: {
      trigger: ".line",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  scaleX: 0,
  x:-90,
  transformOrigin: 'left',
  duration: 0.3,
})

gsap.from(".text-block-animate", {
  scrollTrigger: {
      trigger: ".line",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  y:-90,
  transformOrigin: 'left',
  duration: 0.3,
})

}

gsap.from(".case-study-animate", {
  scrollTrigger: {
      trigger: ".case-study-animate",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  y: 200,
  scale: 0,
  rotate: -45,
  transformOrigin: 'center right',
  duration: 0.3,
})

gsap.from(".case-study-animate2", {
  scrollTrigger: {
      trigger: ".case-study-animate2",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  y: 200,
  scale: 0,
  rotate: 45,
  transformOrigin: 'center left',
  duration: 0.4,
})


const splitTypes = document.querySelectorAll('.reveal-type2')

splitTypes.forEach((char,i) => {

    const text = new SplitType(char,{ types: 'words, chars'})

    gsap.from(text.words, {
       stagger: 0.05,
       opacity: 0,
       y:-90,
       transformOrigin: 'top',
       duration: 0.2,
       delay: 0.3,
    })

    gsap.to(text.chars, {
      scrollTrigger: {
        trigger: ".reveal-type2",
          start: 'top 30%',
          end: 'top 20%',
          scrub: false,
          markers: false,
          toggleActions: 'play play reverse reverse'
      },
      stagger: 0.02,
      opacity: 0,
      y:90,
      transformOrigin: 'bottom',
      duration: 0.2,
   })
   
})

  // GD5 Added handleWindowResize and Event Listener 053125 
  //
  gsap.from(".keyhole", {
    "clip-path": "polygon(0% 0%, 0% 100%, 49% 100%, 49% 25%, 49% 25%, 49% 75%, 49% 75%, 49% 100%, 100% 100%, 100% 0%)",
    scrollTrigger: {
      trigger: ".section5",
      start: "1% 10%", // when the top of the trigger hits the top of the viewport
      end: "10% 0%", // bottom of the trigger hits the bottom of the vp
      scrub: scrub,
      markers: false,
      toggleActions: 'play play reverse reverse'
    },
  })

// ==============================================
// Spline Path Follow Code Starts Here

const startingModelPath = '../models/Scene.glb'
const curvePathJSON = '../models/curvePath.json'

setupScene();

async function setupScene() {

	//Scene is container for objects, cameras, and lights
	const scene = new THREE.Scene();

	await LoadGLTFByPath(scene, startingModelPath);

	let curvePath = await loadCurveFromJSON(scene, curvePathJSON);

	// Comment to remove curve visualization
	// scene.add(curvePath.mesh); 
	
	// Create a camera and set its position and orientation
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	// camera.position.set(6, 3, 10);
	camera.position.copy(curvePath.curve.getPointAt(0))
	camera.lookAt(curvePath.curve.getPointAt(0.99))

	// Add the camera to the scene
	scene.add(camera);
	const renderer = setupRenderer();

	let positionAlongPathState = new PositionAlongPathState();

	window.addEventListener('wheel', onMouseScroll, false);

	function onMouseScroll(event){
		handleScroll(event, positionAlongPathState);
	}

	// Animate the scene
	function animate() {
		requestAnimationFrame(animate);
		updatePosition(curvePath, camera, positionAlongPathState);
		renderer.render(scene, camera);
	}
	animate();


// Spline Path Follow Code Ends Here
// ==============================================


  // GD5 Added handleWindowResize and Event Listener 053125 
  //
  function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log("Window Resize "+window.innerWidth+" x "+window.innerHeight);
  }
  window.addEventListener('resize', handleWindowResize, false);


};



// // Pin Section During Scroll Home Page Spline
// // ==============================================

// // Get the offset position of the navbar
// var navHeight = $('.section5')[0].scrollHeight
// var sidebar = $(".section5")[0]

// // When the user scrolls the page, make the sidebar sticky
// window.onscroll = function() {
//   if (window.pageYOffset >= navHeight) {
//     sidebar.classList.add("sticky")
//   } else {
//     sidebar.classList.remove("sticky");
//   }
// };



// // Lottie Animation Arrow
// // ==============================================

import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

const btn1canvas = document.getElementById("dlBtn1"); // Select canvas by ID

const LottieButton1 = new DotLottie({
    canvas: btn1canvas,
    src: "./Compress_X_1.json", // json file
    renderer: "svg",
    loop: false,
    autoplay: false
});


let btn1pause = 24; // Pause Frame in animation
let btn1end = 60;  // Last Frame in animation

function Btn1Hover() {
    LottieButton1.setSegment(1, btn1pause);
    LottieButton1.play();
}

function Btn1Click() {
    LottieButton1.setSegment(btn1pause, btn1end);
    LottieButton1.play();
}

function Btn1Exit() {
  LottieButton1.playSegments(1, 24);
  LottieButton1.setDirection(-1);
  LottieButton1.play();
}

btn1canvas.addEventListener("mouseenter", Btn1Hover);
btn1canvas.addEventListener("click", Btn1Click);
btn1canvas.addEventListener("mouseleave", Btn1Exit);



// // Pin Section During Scroll Home Page Spline
// // ==============================================


document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("spline-path-canvas");
  const s4 = document.getElementById("section4");
  const scrollThreshold = 2800; // px

  // GD4 Commented out the folloeing code and added new code below 052825
  //     Also added const s4 above to grab bottom of Section4 
  //

  // window.addEventListener("scroll", () => {
  //   if (window.scrollY > scrollThreshold) {
  //     header.classList.add("sticky");
  //     header.classList.remove("nosticky"); // Optional
  //     console.log("window.scrollY: "+window.scrollY);
  //   } else {
  //     header.classList.remove("sticky");
  //     header.classList.add("nosticky");
  //   }
  // });

  window.addEventListener("scroll", () => {
    let s4rect = s4.getBoundingClientRect();
    if (s4rect.bottom <= 0) {
      header.classList.add("sticky");
      header.classList.remove("nosticky"); // Optional
    } else {
      header.classList.remove("sticky");
      header.classList.add("nosticky");
    }
  });
});



// // Case Study Year Update on Scroll
// // ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("activeYear");
  const sections = document.querySelectorAll(".year-section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const year = entry.target.dataset.year;
        yearSpan.textContent = year;
      }
    });
  }, {
    threshold: 0.1 // Adjust as needed (0.1 means 10% of the section is visible)
  });

  sections.forEach(section => observer.observe(section));
});


// G4 Added 052825
// ---- Update Element Height and Width Data in Hero Section
// 
let heroElement = document.getElementById("heroSection");
let heightSpan = document.getElementById("heightSpan");
let widthSpan = document.getElementById("widthSpan");



function updateHeroDimensions() {
  let rect = heroElement.getBoundingClientRect();
  // let heroHeight = heroElement.offsetHeight;
  // let heroWidth = heroElement.clientWidth;
  let heroHeight = rect.bottom;
  let heroWidth = rect.right;

  // console.log("top: "+rect.top+" , bottom: "+rect.bottom+" , left: "+rect.left+" , right "+rect.right);

  heightSpan.innerHTML = heroHeight.toFixed(2).toString();
  widthSpan.innerHTML = heroWidth.toFixed(2).toString();
}

document.addEventListener('scroll', updateHeroDimensions);

document.getElementsByTagName("BODY")[0].onload = function() {updateHeroDimensions()};

document.getElementsByTagName("BODY")[0].onresize = function() {updateHeroDimensions()};



// G5 Added 053125
// ---- Scramble Text on Hover
// 
document.querySelectorAll('.scramble-hover').forEach(element =>
  {
      let randomChars = "abcdefghijklmnopqrtsuvwxyz";
      let originalText = element.dataset.text;
  
      element.addEventListener('mouseover',() => {
          let iterations = 0;
          let interval = setInterval(() => {
              element.textContent = originalText.split("").map
              ((char,index) => {
                  if (index < iterations) return char;
                  return randomChars.charAt(Math.floor(Math.random
                  () * randomChars.length));
              })
              .join("");
              if( iterations >= originalText.length){
                  clearInterval(interval);
              }
              iterations += 1 / 1;
          },60)
      })
  })

  

// G5 Added 053125
// ---- Pixelation Overlay on Hover
// 
  document.addEventListener('DOMContentLoaded', function () {
    const animationStepDuration = 0.3; // Adjust this value to control the timing
    const gridSize = 17; // Number of pixels per row and column (adjustable)
    // Calculate pixel size dynamically
    const pixelSize = 100 / gridSize; // Calculate the size of each pixel as a percentage
    // Select all cards
    const cards = document.querySelectorAll('[data-pixelated-image-reveal]');
    // Detect if device is touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    // Loop through each card
    cards.forEach((card) => {
      const pixelGrid = card.querySelector('[data-pixelated-image-reveal-grid]');
      const activeCard = card.querySelector('[data-pixelated-image-reveal-active]');
      // Remove any existing pixels with the class 'pixelated-image-card__pixel'
      const existingPixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
      existingPixels.forEach(pixel => pixel.remove());
      // Create a grid of pixels dynamically based on the gridSize
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const pixel = document.createElement('div');
          pixel.classList.add('pixelated-image-card__pixel');
          pixel.style.width = `${pixelSize}%`; // Set the pixel width dynamically
          pixel.style.height = `${pixelSize}%`; // Set the pixel height dynamically
          pixel.style.left = `${col * pixelSize}%`; // Set the pixel's horizontal position
          pixel.style.top = `${row * pixelSize}%`; // Set the pixel's vertical position
          pixelGrid.appendChild(pixel);
        }
      }
      const pixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
      const totalPixels = pixels.length;
      const staggerDuration = animationStepDuration / totalPixels; // Calculate stagger duration dynamically
      let isActive = false; // Variable to track if the card is active
      let delayedCall;
      const animatePixels = (activate) => {
        isActive = activate;
        gsap.killTweensOf(pixels); // Reset any ongoing animations
        if (delayedCall) {
          delayedCall.kill();
        }
        gsap.set(pixels, { display: 'none' }); // Make all pixels invisible instantly
        // Show pixels randomly
        gsap.to(pixels, {
          display: 'block',
          duration: 0,
          stagger: {
            each: staggerDuration,
            from: 'random'
          }
        });
        // After animationStepDuration, show or hide the activeCard
        delayedCall = gsap.delayedCall(animationStepDuration, () => {
          if (activate) {
            activeCard.style.display = 'block';
            // **Set pointer-events to none so clicks pass through activeCard**
            activeCard.style.pointerEvents = 'none';
          } else {
            activeCard.style.display = 'none';
          }
        });
        // Hide pixels randomly
        gsap.to(pixels, {
          display: 'none',
          duration: 0,
          delay: animationStepDuration,
          stagger: {
            each: staggerDuration,
            from: 'random'
          }
        });
      };
      if (isTouchDevice) {
        // For touch devices, use click event
        card.addEventListener('click', () => {
          animatePixels(!isActive);
        });
      } else {
        // For non-touch devices, use mouseenter and mouseleave
        card.addEventListener('mouseenter', () => {
          if (!isActive) {
            animatePixels(true);
          }
        });
        card.addEventListener('mouseleave', () => {
          if (isActive) {
            animatePixels(false);
          }
        });
      }
    });
  });
