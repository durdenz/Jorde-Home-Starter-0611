gsap.registerPlugin(ScrollTrigger);

const contents = gsap.utils.toArray("#horizontal .contents");

gsap.to(contents, {
    xPercent: -100 * (contents.length - 1),
    scrollTrigger: {
        trigger: "#horizontal",
        pin: true,
        scrub: 1,
        snap: {
			snapTo: '.contents', // snap to the closest label in the timeline
			duration: { min: 0.2, max: 3 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
			delay: 0.0, // wait 0.2 seconds from the last scroll event before doing the snapping
			ease: 'power1.inOut' // the ease of the snap animation ("power3" by default)
		},

    }
})