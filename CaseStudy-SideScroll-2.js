// 061125 G4 Modified ScrollTrigger and snap options

gsap.registerPlugin(ScrollTrigger);

let contents = gsap.utils.toArray(".contents");

gsap.to(contents, {
    xPercent: -100 * (contents.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: "#horizontal",
        pin: true,
        start: "top top",
        scrub: 1,
        // snap: 1 / (contents.length - 1),
        snap: {
            snapTo: (1 / (contents.length - 1)),
            // snapTo: '.contents',
            inertia: false,
            duration: { min: 0.2, max: 3 },
            delay: 0.0,
            ease: 'power1.inOut',
        },
        end: () => "+=" + (document.querySelector("#horizontal").offsetWidth)
    }
})
