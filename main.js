// Declare required variables 
const track = document.querySelector(".image-track");
const body = document.querySelector("body");
const imgs = track.querySelectorAll('.image img') // images from track
const img_selector = document.querySelectorAll(".img_selector"); //option to change current image while expanded
const x = document.querySelector(".x"); // element at the center of the screen (white cross/current styles hidden) can be used to determine which element/page is at the center
const slider = document.querySelectorAll('.slider_image')

// Change animation duration for different phases of actions, if needed 
anim_dur_tack_move = 1200 // duration of animation when user drags mouse and track transform translates
anim_dur_obj_move = 1200 // duration of animation for obj inside images shifting their position along with track
anim_dur_cover_expand = 350
width = '40vmin'; // dimensions of images
height = '56vmin';


document.querySelector('.dimensions').innerHTML = `Width: ${window.innerWidth}, Height: ${window.innerHeight}`





const container =  document.querySelector(".container")
const items = container.querySelectorAll('.item')
const main_item = container.querySelector('.container .c-3 .main_img')
// main_item.style.border = '1px solid white'
document.querySelector(".wrapper").style.display = 'none'

orig_size = main_item.getBoundingClientRect()
gsap.registerPlugin()

let tl = gsap.timeline({delay:0})

tl.to('.col',{
  top: 0,
  duration: 2.5,
  ease: 'power4.inOut'
})


tl.to('.c-1 .item',{
  top: 0,
  stagger: 0.25,
  duration: 3,
  ease: 'power4.inOut'
}, '-=2')
tl.to('.c-2 .item',{
  top: 0,
  stagger: -0.25,
  duration: 3,
  ease: 'power4.inOut'
}, '-=4')
tl.to('.c-3 .item',{
  top: 0,
  stagger: 0.25,
  duration: 3,
  ease: 'power4.inOut',
  onComplete: () => {}
}, '-=4')
tl.to('.c-4 .item',{
  top: 0,
  stagger: -0.25,
  duration: 3,
  ease: 'power4.inOut'
}, '-=4')
tl.to('.c-5 .item',{
  top: 0,
  stagger: 0.25,
  duration: 3,
  ease: 'power4.inOut'
}, '-=4')


scale_factor = [ window.innerWidth/ (orig_size.width+12), (window.innerHeight)/ (orig_size.height+12) ]
tl.to('.container',{
  scaleX: scale_factor[0],
  scaleY: scale_factor[1],
  duration:2,
  gap: '2em',
  ease: 'power3.inOut',
  onComplete: () => {console.log(main_item.getBoundingClientRect()), callback()}
}, '-=2')


//  General states to manipulate DOM
clicked = true;
intro_finished = false;

function callback() {
document.querySelector('.wrapper').style.display = 'flex'
imgs[0, 1, 2].style.visibility = 'hidden'
document.querySelector('.text_appear_container').style.display='block' 
track.querySelectorAll('.image > div').forEach((target) => {target.style.pointerEvents = 'all'}) // even though cover elements are fixed, they're restricted with z-index of parent element

if (isNaN(Number(track.dataset.percentage))) {
track.dataset.percentage = 0;
track.dataset.mouseDownAt = "0";
track.dataset.prevPercentage = track.dataset.percentage;
}

const cover = imgs[0].nextElementSibling;

window.currCover = cover // Make cover global, to keep information about which image is currently expanded 
window.currImage = imgs[0]; 
window.currSliderImg = parseInt(window.currCover.dataset.coverId) - 1


item_size = main_item.getBoundingClientRect()

// copy it's content and positions
cover.style.zIndex = "10";
cover.style.backgroundImage = `url(${imgs[0].src})`;
cover.style.display = "block";  // Show cover
cover.style.width = `${item_size.width}px`;
cover.style.height = `${item_size.height}px`;
cover.style.left = `${item_size.left}px`; 
cover.style.top = `${item_size.top}px`; // fill left side of the page

// cover.style.top = `${orig_size.height*2 +31}` + "px";
// cover.style.transform = `scale(${scale_factor[0]}, ${scale_factor[1]})`;
container.style.display = 'none'

gsap.to(cover, {
  width: "100vw",
  height: "100vh",
  left: "0px",
  top: "0px",
  duration: 2,
  ease: 'circ.out',
  onComplete:()=>{animate_slider(imgs), intro_finished = true}
});


  // Actions linked with images expanding 
  text_appearAnimation(cover); // Annimate name of the project
  crossAnimate(); // Animate name image selectors 
  // Update current page to expanded image
  let odometerTimeout;
  clearTimeout(odometerTimeout); // Clear any existing timeout
  odometerTimeout = setTimeout(() => {
    document.querySelector(".odometer").innerHTML = cover.dataset.coverId;
  }, 80);


  imgs[0].style.visibility = 'hidden'



      // Special additional animation for exanding image
      cover_copy = cover.cloneNode();
      cover_copy.classList.add("cover_copy");
      imgs[0].parentElement.appendChild(cover_copy);
      cover_copy.style.width = "3.5vw"; 
      cover_copy.style.height = "4vh";
      cover_copy.style.left = `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover_copy.dataset.coverId) * 3.7}vw)`;
      cover_copy.style.top = "120vh";
      cover_copy.style.display = "block";
      cover_copy.style.position = 'fixed'
      window.currCoverCopy = cover_copy

    // Additional animation for expanding image
    cover_copy.animate(
      {
        top: "90vh", //fix bug when top is limited to track height
      },
      {
        duration: 1200, // Animation duration in milliseconds
        easing: "ease-in-out", // Easing function
        fill: "forwards", // Keeps the final state of the animation
      }
    );



  imgs.forEach((otherImage) => {
    if (otherImage != imgs[0]) {
      const cover = otherImage.nextElementSibling; //set copy to cover image, then hide image itself until image is expanded, add animation

      // set styles for copy
      cover.style.left = `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.7}vw)`;
      cover.style.top = "120vh";
      cover.style.width =  "3.5vw";
      cover.style.height = "4vh";
      cover.style.backgroundImage = `url(${otherImage.src})`;
      cover.style.zIndex = "11";



      cover.style.display = "block"; // Show cover 
      otherImage.style.visibility = "hidden";  //Hide contents of the image

      // Animate images
      cover.animate(
        {
          top: "90vh",
        },
        {
          duration: 1200,
          fill: "forwards",
          delay: 100,
        }
      );
      
      setTimeout(()=>{
        intro_finished = true;
        clicked = true;
      }, 2000)
      

      // Change curent slide if user clicked 
      cover.addEventListener('click', (e) => {
        change_slide_clicked_cover(parseInt(e.target.dataset.coverId)-1)
      })
    }
    else {
      window.currCoverCopy.addEventListener('click', (e) => {
        change_slide_clicked_cover(parseInt(e.target.dataset.coverId)-1)
      })
    }
  });
}






slider_copy_imgs()
createRotationAnimation()
const lines = document.querySelectorAll(".x svg .linesAnimation");
lines.forEach(function (line) {
  line.beginElement();
  line.setAttribute("fill", "freeze");
  line.setAttribute("dur", "0.5s");
  line.setAttribute("delay", "0.3s");
  line.setAttribute("easing", "ease-out");
});



const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);
const handleOnUp = () => {
  if (clicked == false) {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
  }
};
// Handle user drag -> move imge track / if image is expanded, shrink it / Show current page at the center of the page
const handleOnMove = (e) => {
   // Image track
  if (track.dataset.mouseDownAt === "0") return;
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    maxDelta = window.innerWidth / 2;
  
  var percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  track.dataset.percentage = nextPercentage;
  track.dataset.percentageDelta = Math.abs(
    track.dataset.prevPercentage - track.dataset.percentage
  );

  if (isNaN(Number(track.dataset.percentage))) {
    nextPercentage = 0;
    }

  if (clicked == false) {
    // Translate track to the left
    track.animate(
      {
        transform: `translate(${nextPercentage}%, 0%)`,
      },
      { duration: anim_dur_tack_move, fill: "forwards" }
    );
    // Animate objects inside images (shift them to left)
    for (const image of imgs) {
      image.animate(
        {
          objectPosition: `${100 + nextPercentage}% center`,
        },
        { duration: anim_dur_obj_move, fill: "forwards",  easing:'ease-in'}
      );
      // Try for current position, if nextPercentage is not defined, do nothing
      try {
        image.nextElementSibling.animate(
          { backgroundPosition: `${100 + nextPercentage}% center` },
          { duration: anim_dur_obj_move, fill: "forwards", easing:'ease-in'}
        );
      } catch {}
    }

  // Logic for the x(cross) element on the screen that determines current page
       curr_page_track(imgs, x)
  }


  // Drag to escape exdanded image
  if (clicked == true && parseFloat(track.dataset.percentageDelta) > 2 && intro_finished == true) {
    // animate other images into their initial state 
    if (window.currSliderImg == parseInt(window.currCover.dataset.coverId) - 1){
      // animate expanded image to initial state
      animation_expanded_out()
      animation_imgs_out(imgs)
      console.log('1 condition is triggered')
    }
    else {

      track.dataset.percentage = -(window.currSliderImg)*12
      track.dataset.prevPercentage = -(window.currSliderImg)*12
      track.dataset.percentageDelta = (window.currSliderImg)*12
      track.animate(
        {
          transform: `translate(${-(window.currSliderImg)*12}%, 0%)`,
        },
        { duration: 5, fill: "forwards" }
      );
      for (const image of imgs) {
        image.animate(
          {
            objectPosition: `${100 + -(window.currSliderImg)*12}% center`,
          },
          { duration: 5, fill: "forwards",  easing:'ease-in'}
        );
        // Try for current position, if -(window.currSliderImg)*12 is not defined, do nothing
        try {
          image.nextElementSibling.animate(
            { backgroundPosition: `${100 + -(window.currSliderImg)*12}% center` },
            { duration: 5, fill: "forwards", easing:'ease-in'}
          );
        } catch {} }
      // animate expanded image to initial state
      animation_expanded_out()
      animation_imgs_out_diff_img(imgs)
    }
    
  // Hide the option to change current expanded image
  img_selector[0].style.display = "none";
  img_selector[1].style.display = "none";
  }

};

//Add All event listeners related to user mouse movements (drag)
let isMouseDown = false;
window.onmousedown = (e) => {
  handleOnDown(e);
  isMouseDown = true;
};
window.ontouchstart = (e) => {
  handleOnDown(e.touches[0]);
  isMouseDown = true;
};
window.onmouseup = (e) => {
  handleOnUp(e);
  isMouseDown = false;
};
window.ontouchend = (e) => {
  handleOnUp(e.touches[0]);
  isMouseDown = false;
};
window.onmousemove = (e) => {
  if (isMouseDown) {
    handleOnMove(e);
  }
};
window.ontouchmove = (e) => {
  if (isMouseDown) {
    handleOnMove(e.touches[0]);
  }
};



  // Logic for images after being clicked

imgs.forEach(function (image) {
  // for each image in image track add 'click' event listener
  image.addEventListener("click", (e) => {
    clicked = true; // update website current state
    document.querySelector('.text_appear_container').style.display='block' 
    track.querySelectorAll('.image > div').forEach((target) => {target.style.pointerEvents = 'all'}) // even though cover elements are fixed, they're restricted with z-index of parent element

if (isNaN(Number(track.dataset.percentage))) {
  track.dataset.percentage = 0;
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
}

    // Image track and it's images have relative position, we can't properly animate them changing their properties and positions
    // They will stay at their respective poisitions, but we will display copies of images instead and hide img-track to make ilussion of original elements being animated

    const cover = e.target.nextElementSibling;
  
    window.currCover = cover // Make cover global, to keep information about which image is currently expanded 
    window.currImage = e.target; 

    // copy it's content and positions
    image_positon = e.target.getBoundingClientRect();

    cover.style.left = e.target.offsetLeft + "px";
    cover.style.right = e.target.offsetRight + "px";
    cover.style.top = e.target.offsetTop + "px";
    cover.style.bottom = e.target.offsetBottom + "px";
    cover.style.width = image_positon.width + "px";
    cover.style.height = image_positon.height + "px";
    cover.style.zIndex = "10";
    cover.style.backgroundImage = `url(${e.target.src})`;

    // Special additional animation for exanding image
    cover_copy = cover.cloneNode();
    cover_copy.classList.add("cover_copy");
    image.parentElement.appendChild(cover_copy);
    cover_copy.style.width = "3.5vw"; 
    cover_copy.style.height = "4vh";
    cover_copy.style.left = `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover_copy.dataset.coverId) * 3.7}vw)`;
    cover_copy.style.top = "100vh";
    cover_copy.style.display = "block";
    cover_copy.style.position = 'fixed'

    window.currCoverCopy = cover_copy
  
    cover.style.display = "block";  // Show cover
    e.target.style.visibility = "hidden";    // Hide contents of the image

    // Animate expanding image
    cover.animate(
      {
        width: [cover.style.width, "100vw"],
        height: [cover.style.height, "100vh"],
        left: `${-track.dataset.percentage}%`, // fill left side of the page
        top: `-${track.getBoundingClientRect().top}` + "px", //fix bug when top is limited to track height
        backgroundPosition: 'center center'
      },
      {
        duration: anim_dur_cover_expand, // Animation duration in milliseconds
        easing: "ease-in-out", // Easing function
        fill: "forwards", // Keeps the final state of the animation
      }
    );
    

    // Additional animation for expanding image
    cover_copy.animate(
      {
        top: "70vh", //fix bug when top is limited to track height
      },
      {
        duration: 1000, // Animation duration in milliseconds
        easing: "ease-in-out", // Easing function
        fill: "forwards", // Keeps the final state of the animation
      }
    );

    // Actions linked with images expanding 
      text_appearAnimation(cover); // Annimate name of the project
      crossAnimate(); // Animate name image selectors 
      // Update current page to expanded image
      let odometerTimeout;
      clearTimeout(odometerTimeout); // Clear any existing timeout
      odometerTimeout = setTimeout(() => {
        document.querySelector(".odometer").innerHTML = cover.dataset.coverId;
      }, 80);
      animate_slider(imgs)

    // Animate images that are not clicked
    imgs.forEach((otherImage) => {
      if (otherImage != e.target) {
        const cover = otherImage.nextElementSibling; //set copy to cover image, then hide image itself until image is expanded, add animation

        // set styles for copy
        cover.style.left = otherImage.offsetLeft + "px";
        cover.style.top = otherImage.offsetTop + "px";
        cover.style.width = otherImage.getBoundingClientRect().width + "px";
        cover.style.height = otherImage.getBoundingClientRect().height + "px";
        cover.style.backgroundImage = `url(${otherImage.src})`;
        cover.style.zIndex = "11";



        cover.style.display = "block"; // Show cover 
        otherImage.style.visibility = "hidden";  //Hide contents of the image

        // Animate images
        cover.animate(
          {
            top: "70vh",
            height: "4vh",
            width: "3.5vw",
            left:`calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.7}vw)`,
          },
          {
            duration: anim_dur_cover_expand+200,
            fill: "forwards",
            delay: parseInt(cover.dataset.coverId)*40,
          }
        );




        // Change curent slide if user clicked 
        cover.addEventListener('click', (e) => {
          console.log(e.target.dataset.coverId, 'cover is clicked')
          change_slide_clicked_cover(parseInt(e.target.dataset.coverId)-1)
        })
      }
      else {
        window.currCoverCopy.addEventListener('click', (e) => {
          console.log(e.target.dataset.coverId, 'cover is clicked')
          change_slide_clicked_cover(parseInt(e.target.dataset.coverId)-1)
        })
      }
    });

    
  });
});


//Animate slider when preview elements are clicked
function change_slide_clicked_cover(coverId) {
  if (coverId > window.currSliderImg) {
    slider[coverId].animate({left:['100vw', '0vw'], width: ['0vw','100vw'], height:['100vh', '100vh']},{duration:600, fill:'forwards', easing:'ease-out'}) // next image
    slider[window.currSliderImg].animate({right:['0vw', '100vw'], width:['100vw', '0vw'], height:['100vh', '100vh']},{duration:800, fill:'forwards', easing:'ease-out'}) // current image


    for (i=window.currSliderImg+1; i<coverId; i++) {
      slider[i].animate({left:['100vw', '0vw'], width:['100vw', '0vw'], height:['100vh', '100vh']},{duration:0.1, fill:'forwards', easing:'ease-out'}) 
    }

    // Actions linked to current image shown
    crossAnimateRotate()
    text_appearAnimationReverse(slider[window.currSliderImg])

    setTimeout(()=>{
      text_appearAnimation(slider[window.currSliderImg])
    }, 701)



    //update current image id
    window.currSliderImg = coverId;


    let odometerTimeout;
    clearTimeout(odometerTimeout); // Clear any existing timeout
    odometerTimeout = setTimeout(() => {
      document.querySelector(".odometer").innerHTML = window.currSliderImg;
    }, 80);
  }
  else if (coverId < window.currSliderImg) {
    slider[coverId].animate({left:'0vw', width:['0vw','100vw'], height:['100vh', '100vh']},{duration:600, fill:'forwards', easing:'ease-out'}) // previous image
    slider[window.currSliderImg].animate({left:['0vw','100vw'], width:['100vw', '0vw'], height:['100vh', '100vh']},{duration:600, fill:'forwards', easing:'ease-out'}) // current image


    // Actions linked to current image shown
    crossAnimateRotateReverse()
    
    text_appearAnimationReverse(slider[window.currSliderImg])
    setTimeout(()=>{
      text_appearAnimation(slider[window.currSliderImg])
    }, 701)
    
    //update current image id
    window.currSliderImg = coverId;

    let odometerTimeout;
    clearTimeout(odometerTimeout); // Clear any existing timeout
    odometerTimeout = setTimeout(() => {
      document.querySelector(".odometer").innerHTML = window.currSliderImg;
    }, 80);
  }
}


// Animate name of the project appearing when image is being shown
function text_appearAnimation(element) {
  
  // Select our text div
  const text = document.querySelector(".text_appear");
  // Content of text based on what element is clicked
  text.innerHTML = element.querySelector("h1").innerHTML;
  //animate appearance
  text.animate(
    { transform: 'translate(0%, 0%)'},
    { duration: 390, fill: "forwards", easing: "ease-in-out", delay: 50 }
  );
}

// Animate name of the project vanishing
function text_appearAnimationReverse(element) {
  // Select our text div
  const text = document.querySelector(".text_appear");

  text.animate(
    { transform: 'translate(0%, -100%)'},
    { duration: 390, fill: "forwards", easing: "ease-in-out" }
  );

  setTimeout(() => {
    text.animate({transform: 'translate(0%, 135%)' }, { duration: 0.1, fill: "forwards" });
  }, 390);
}

//Animate cross selectors appearing
function crossAnimate() {
  const lines = document.querySelectorAll(".cross svg .linesAnimation");
  lines.forEach(function (line) {
    line.beginElement();
    line.setAttribute("fill", "freeze");
    line.setAttribute("dur", "0.5s");
    line.setAttribute("delay", "0.3s");
    line.setAttribute("easing", "ease-out");
  });
}
// Reversed animation of crosses
function crossAnimateReverse() {
  const lines = document.querySelectorAll("svg .linesAnimationReverse");
  lines.forEach(function (line) {
    line.beginElement();
    line.setAttribute("fill", "freeze");
    line.setAttribute("dur", "0.3s");
    line.setAttribute("delay", "0.3s");
    line.setAttribute("easing", "ease-out");
  });
}

function createRotationAnimation() {
  const lines = document.querySelectorAll('line');

    lines.forEach(line => {
      const animateTransform = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
      animateTransform.setAttribute("attributeName", "transform");
      animateTransform.setAttribute("attributeType", "XML");
      animateTransform.setAttribute("type", "rotate");
      animateTransform.setAttribute("from", "0 11 11");
      animateTransform.setAttribute("to", "90 11 11");
      animateTransform.setAttribute("dur", "0.25s");
      animateTransform.setAttribute("easing", "ease-out");
      // animateTransform.setAttribute("repeatCount", "indefinite");
      animateTransform.classList.add("rotateAnimation");
      line.appendChild(animateTransform);
});
}

function crossAnimateRotate() {
  const animations = document.querySelectorAll('.rotateAnimation');
  animations.forEach(animation => {
    animation.setAttribute("from", "0 11 11");
    animation.setAttribute("to", "90 11 11");
    animation.beginElement();
  });
}

function crossAnimateRotateReverse() {
  const animations = document.querySelectorAll('.rotateAnimation');
  animations.forEach(animation => {
    animation.setAttribute("from", "90 11 11");
    animation.setAttribute("to", "0 11 11");
    animation.beginElement();
  });
}






// keep track of current page 
const curr_page_track = (images, x) => {
  const xRect = x.getBoundingClientRect();
  const xCenter = xRect.left + xRect.width / 2; // Calculate the center of the x element

  let currentImageId = null;
  // get coordinates of each image 
  images.forEach((image) => {
    const imageRect = image.getBoundingClientRect();
    const imageLeft = imageRect.left;
    const imageRight = imageRect.right;
  
    if (xCenter >= imageLeft && xCenter <= imageRight) {
      currentImageId = image.dataset.imageId;
      let odometerTimeout;
      clearTimeout(odometerTimeout); // Clear any existing timeout
      odometerTimeout = setTimeout(() => {
        document.querySelector(".odometer").innerHTML = currentImageId; // set current page
      }, 80); // Adjust the delay time as needed
      return; // Stop looping through images
    }
  });
} 








// Image slider, when image is expanded 
    // Because cover element for image clicked is only one positioned full-page, we copy it's contents and place it in right low corner
    // Then naviate images through cover_slider elements 

// Set up corresponding bakcground image for each img
function slider_copy_imgs () {
  for (i = 0; i<8; i++)  {
    slider[i].style.backgroundImage = `url(${imgs[i].src})`

    const newH1 = document.createElement("h1");
    newH1.innerHTML = imgs[i].nextElementSibling.querySelector("h1").innerHTML;
    // Append the new h1 element to the slider[i] element
    slider[i].appendChild(newH1);
  }
}

// Function called when image is clicked, to setup image slider in image expanded state
const animate_slider = (imgs) => {
  setTimeout(()=>{
    window.currSliderImg = parseInt(window.currCover.dataset.coverId) - 1// Keep track of current image of slider
    // Display Slider selectors
    for (selector of img_selector){
      selector.style.display = 'block' // Enable selector zones -> 50% of left side / 50% of right side
    }
    slider.forEach(slide => {
      slide.style.width = '0vw'
      slide.style.height = '0vh'
      slide.style.left = '0px'
    })

    slider[window.currSliderImg].animate({left:'0px', width:['100vw', '100vw'], height:'100vh'},{duration: 1, fill:'forwards'})
    window.currCover.style.visibility = "hidden";
  },anim_dur_cover_expand)
}


// Event listeners for slider selector's clicks 
img_selector[0].addEventListener('click', (e)=>{slider_main(e)})
img_selector[1].addEventListener('click', (e)=>{slider_main(e)})

  
// Call function for click event listener. Logic to select next or previous image
const slider_main = (e) => {
  if (e.target.classList[0] == 'next_img' &&  window.currSliderImg<7) {

    slider[window.currSliderImg+1].animate({left:['100vw', '0vw'], width: ['0vw','100vw'], height:['100vh', '100vh']},{duration:600, fill:'forwards', easing:'ease-out'}) // next image
    slider[window.currSliderImg].animate({right:['0vw', '100vw'], width:['100vw', '0vw'], height:['100vh', '100vh']},{duration:800, fill:'forwards', easing:'ease-out'}) // current image

    // Actions linked to current image shown
    crossAnimateRotate()
    text_appearAnimationReverse(slider[window.currSliderImg])

    setTimeout(()=>{
      text_appearAnimation(slider[window.currSliderImg])
    }, 701)



    //update current image id
    window.currSliderImg += 1;


    let odometerTimeout;
    clearTimeout(odometerTimeout); // Clear any existing timeout
    odometerTimeout = setTimeout(() => {
      document.querySelector(".odometer").innerHTML = window.currSliderImg+1;
    }, 80);
  }


  else if (e.target.classList[0] == 'prev_img' &&  window.currSliderImg>0) {
    slider[window.currSliderImg-1].animate({left:'0vw', width:['0vw','100vw'], height:['100vh', '100vh']},{duration:600, fill:'forwards', easing:'ease-out'}) // previous image
    slider[window.currSliderImg].animate({left:['0vw','100vw'], width:['100vw', '0vw'], height:['100vh', '100vh']},{duration:600, fill:'forwards', easing:'ease-out'}) // current image


    // Actions linked to current image shown
    crossAnimateRotateReverse()
    
    text_appearAnimationReverse(slider[window.currSliderImg])
    setTimeout(()=>{
      text_appearAnimation(slider[window.currSliderImg])
    }, 701)

    
    //update current image id
    window.currSliderImg -= 1;
    
    let odometerTimeout;
    clearTimeout(odometerTimeout); // Clear any existing timeout
    odometerTimeout = setTimeout(() => {
      document.querySelector(".odometer").innerHTML = window.currSliderImg+1;
    }, 80);
  }

}  






// Actions triggered when expanded image is dragged out by user


const animation_expanded_out = () => {
  clicked = false;
  document.querySelector('.text_appear_container').style.display='none'

  const cover = window.currCover;
  const currImage = imgs[window.currSliderImg];
  const image_positon = currImage.getBoundingClientRect();

 
  slider[window.currSliderImg].animate({width:'0vw', height:'100vh', left: '0px'},{duration:1, fill:'forwards'})
  cover.style.backgroundImage = `url(${currImage.src})`;
  cover.style.visibility = "visible";

  // animate expanded cover shrinking
  cover.animate(
    {
      width: ["100vw", image_positon.width + "px"],
      height: ["100vh", image_positon.height + "px"],
      left: [`${-track.dataset.percentage}%`, currImage.offsetLeft + "px"],
      top: [
        `0px`,
        currImage.offsetTop + "px",
      ],
    },
    {
      duration: 600, // Animation duration in milliseconds
      easing: "ease-out", // Easing function
      fill: "forwards", // Keeps the final state of the animation
    }
  );

  // animate text for the image dissapear
  try {
    text_appearAnimationReverse(cover);
  } catch {}

  // Animate Crosses dissapear
  crossAnimateReverse();

  // animate small cover in right corner disappearing
  if (window.currImage != imgs[window.currSliderImg]){
    window.currCoverCopy.style.left = `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.5}vw)`
    window.currCoverCopy.style.backgroundImage = `url(${imgs[window.currSliderImg].src})`
  }
  window.currCoverCopy.animate(
    { marginTop: "100vh" },
    { duration: 2500}
  );
  setTimeout(() => {
    // Make original images visible again
    currImage.style.visibility = "visible";
    cover.style.display = "none";

    // Hide additional element for expanded image
    window.currCoverCopy.style.display = "none";
    document.querySelector('.cover_copy').remove()
    if (window.currImage != imgs[window.currSliderImg]){
      cover.animate({left:`${window.currImage.offsetLeft + 'px'}`},{duration:1, fill:'forwards'})
    }
  }, 600);
}


const animation_imgs_out = (imgs) => {
  imgs.forEach((otherImage) => {
    // target other images
    if (otherImage != window.currImage) {
      const cover = otherImage.nextElementSibling; // select cover elements positioned in low right corner of the screen
      const coverRect = cover.getBoundingClientRect(); // get their coordinates 

      // Animate cover element's going back to their positions
      cover.animate(
        {
          top: [`70vh`, otherImage.offsetTop + "px"],
          left: [
            `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.7}vw)`,
            otherImage.offsetLeft + "px",
          ],
          height: [`${coverRect.height}px`, height],
          width: [`${coverRect.width}px`, width],
        },
        {
          duration: 500,
          fill: "forwards",
          // delay: `${parseInt(cover.dataset.coverId) * 50}`,
        }
      );
      // after cover animation's are settled, hide them
      setTimeout(() => {
        otherImage.style.visibility = "visible";
        cover.style.display = "none";
      }, 600);
    }
  });
}





const animation_imgs_out_diff_img = (imgs) => {
  const cover = imgs[window.currSliderImg].nextElementSibling;
  cover.style.left =   `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.7}vw)`,
  cover.style.backgroundImage = `url(${window.currCover.previousElementSibling.src})`;
  const coverRect = cover.getBoundingClientRect(); // get their coordinates 

  cover.animate(
    {
      top: [`70vh`, window.currImage.offsetTop + "px"],
      left: [
         `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.7}vw)`,
        window.currImage.offsetLeft + "px",
      ],
      height: [`${coverRect.height}px`, height],
      width: [`${coverRect.width}px`, width],
    },
    {
      duration: 500,
      fill: "forwards",
      // delay: `${parseInt(window.currCover.dataset.coverId) * 25}`,
    }
  );
  setTimeout(() => {
    window.currImage.style.visibility = "visible";
    cover.style.display = "none";
    // // cover.style.left = imgs[window.currSliderImg].offsetLeft + 'px'
    cover.animate({left: `${imgs[window.currSliderImg].offsetLeft + 'px'}`},{duration:0.001, fill:'forwards'})
    cover.style.backgroundImage = `url(${imgs[window.currSliderImg].src})`;
  }, 600);


  imgs.forEach((otherImage) => {
    // target other images
    if (otherImage != imgs[window.currSliderImg] && otherImage != window.currImage) {
      const cover = otherImage.nextElementSibling; // select cover elements positioned in low right corner of the screen
      const coverRect = cover.getBoundingClientRect(); // get their coordinates 

      // Animate cover element's going back to their positions
      cover.animate(
        {
          top: [`70vh`, otherImage.offsetTop + "px"],
          left: [
            `calc(${-track.dataset.percentage}% + ${65 + parseInt(cover.dataset.coverId) * 3.7}vw)`,
            otherImage.offsetLeft + "px",
          ],
          height: [`${coverRect.height}px`, height],
          width: [`${coverRect.width}px`, width],
        },
        {
          duration: 500,
          fill: "forwards",
          // delay: `${parseInt(cover.dataset.coverId) * 25}`,
        }
      );
      // after cover animation's are settled, hide them
      setTimeout(() => {
        otherImage.style.visibility = "visible";
        cover.style.display = "none";
      }, 600);
    }
  });
}


