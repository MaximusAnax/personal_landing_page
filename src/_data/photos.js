// Personal photos. `portrait` sits in the About section; `tiles` fly out with the milestones
// at the bottom of the home page. Captions are short labels, not sentences.
module.exports = {
  // `position` is the CSS object-position used to crop the photo into the tall About frame.
  portrait: { src: "/assets/img/skydive.jpg", alt: "Abdoul mid tandem skydive, pointing at the camera", width: 1215, height: 671, position: "50% 50%" },
  tiles: [
    { src: "/assets/img/skydive.jpg", alt: "Abdoul mid tandem skydive, pointing at the camera", caption: "Skydiving" },
    { src: "/assets/img/matcha.jpg", alt: "Abdoul smiling up at the camera, holding an iced matcha", caption: "Matcha run" },
    { src: "/assets/img/portrait.jpg", alt: "Abdoul holding a baby goat", caption: "Met a goat" },
  ],
};
