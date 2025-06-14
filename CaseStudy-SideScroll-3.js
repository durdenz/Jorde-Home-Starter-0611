// 061125 G4 Modified ScrollTrigger and snap options

// 061425 G4 Added Creation of OffsetsArray containing offsets calculated from each element 
// with the .contents class. Also modified gsap.to() to use OffsetsArray and to 
// Calculate xPercent using totalWidth as a percentage of window.innerWidth.

gsap.registerPlugin(ScrollTrigger);

let contents = gsap.utils.toArray(".contents");
let OffsetsArray = [0];
let totalWidth = 0;

function makeOffsetsArray(elementsArray) {
    let xPos, xWidth, offset = 0;
    totalWidth = 0;

    for(i=0; i<(contents.length-1); i++) {
        totalWidth+=contents[i].offsetWidth;
    }

    elementsArray.forEach(element => {
        xPos = element.getBoundingClientRect().left;
        xWidth = element.offsetWidth;
        offset = ((xPos + xWidth)/totalWidth);
        OffsetsArray.push(offset);
    });
    OffsetsArray.pop();
    return;
}

makeOffsetsArray(contents);

// Debug Info
for(i=0; i<(OffsetsArray.length); i++) {
    console.log("OffsetsArray["+i+"] = "+OffsetsArray[i]);
};

// console.log("Orig xPercent: "+(1 / (contents.length - 1)));
console.log("new xPercent: "+(-(totalWidth/window.innerWidth)*100));


gsap.to(contents, {
    xPercent: -((totalWidth/window.innerWidth)*100),
    ease: "none",
    scrollTrigger: {
        trigger: "#horizontal",
        pin: true,
        start: "top top",
        scrub: 1,
        snap: {
            // snapTo: (1 / (contents.length - 1)),
            snapTo: OffsetsArray,
            inertia: false,
            duration: { min: 0.1, max: 0.1 },
            delay: 0.0,
            ease: 'power1.inOut',
        },
        end: () => "+=" + (document.querySelector("#horizontal").offsetWidth)
    }
})
