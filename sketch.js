let img;
let env;
let noiseOsc;
let underwaterOsc;
let filter;
let filterFreqSlider;
let imageDisplayed = false;

function preload() {
  img = loadImage('dive.jpg');
}

function setup() {
  createCanvas(640, 360);
  imageMode(CENTER);

  noiseOsc = new p5.Noise('white');
  noiseOsc.start();
  noiseOsc.amp(0);

  underwaterOsc = new p5.Oscillator('sine');
  underwaterOsc.freq(220);
  underwaterOsc.amp(0);
  underwaterOsc.start();

  filter = new p5.LowPass();
  noiseOsc.disconnect();
  noiseOsc.connect(filter);
  filter.freq(500);
  filter.res(20);

  env = new p5.Envelope();
  env.setADSR(0.001, 0.2, 0.2, 0.5);
  env.setRange(1, 0);

  let underwaterEnv = new p5.Envelope();
  underwaterEnv.setADSR(0.5, 0.5, 0.5, 1);
  underwaterEnv.setRange(0.3, 0);
  underwaterOsc.amp(underwaterEnv);

  // Initialize the slider for filter frequency
  filterFreqSlider = createSlider(100, 1000, 500);
  filterFreqSlider.position(10, height + 30);
}

function draw() {
  background(220);
  if (img && imageDisplayed) {
    image(img, width / 2, height / 2, 200, 200);
    text('Enjoy the dive!', 10, 50);
  } else {
    text('Click the canvas to simulate the diving event!', 10, 30);
  }

  // Update the filter frequency based on the slider's value
  filter.freq(filterFreqSlider.value());

  // Optionally, display the current value of the filter frequency
  text(`Filter Frequency: ${filterFreqSlider.value()} Hz`, 10, height + 50);
}

function mousePressed() {
  imageDisplayed = true;
  playSound();
}

function playSound() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume().then(() => {
      console.log('Audio Context resumed!');
      triggerSoundEffects();
    });
  } else {
    triggerSoundEffects();
  }
}

function triggerSoundEffects() {
  // Play the splash sound
  env.play(noiseOsc);

  // After the splash, simulate going underwater
  setTimeout(() => {
    underwaterOsc.freq(100, 1); // Lower the frequency for an underwater feel
    // Increase underwater oscillator volume to simulate submersion
    underwaterOsc.amp(0.3, 1); 
  }, 500); // Start this effect 0.5 seconds after the splash

  // Schedule the sounds to stop after a set duration
  setTimeout(() => {
      noiseOsc.amp(0, 1); // Fade out the noise oscillator
      underwaterOsc.amp(0, 1); // Fade out the underwater oscillator
      imageDisplayed = false; // Optionally, hide the image to simulate the end of the event
  }, 5000); // Stop the sounds 5 seconds after they start
}
