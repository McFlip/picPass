var rounds = 10; //original n for lamportHash


// Linear Congruential Generator
// Variant of a Lehman Generator
var lcg = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
  var m = 4294967296,
      // a - 1 should be divisible by m's prime factors
      a = 1664525,
      // c and m should be co-prime
      c = 1013904223,
      seed, z;
  return {
    setSeed : function() {
      var seedArray = new ArrayBuffer(4);
      var seed32 = new Uint32Array(seedArray);
      z = seed = window.crypto.getRandomValues(seed32)[0];
    },
    getSeed : function() {
      return seed;
    },
    rand : function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      return z;
    }
  };
}());

function download(){
  var download = document.getElementById("download");
  var image = document.getElementById("canvas").toDataURL("image/png")
  .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
  document.getElementById("register").disabled = false;
}

function dataUrlToBase64 (dataURL){
  return dataURL = dataURL.split(",").pop();
}

function lamportHash(callback, hash, rnd){
  var tempstr = hash.toString();
  for(i = 1; i < rnd; i++){
    hash = CryptoJS.SHA256(tempstr);
    tempstr = hash.toString();
    console.log(tempstr);
  }
  document.getElementById('sha').value = hash.toString();
  document.getElementById('shab64').value = hash.toString(CryptoJS.enc.Base64);
  callback(); // enable the download button
}

function stego(buffer) { // buffer is dataURL
  var image = new Image();
  image.src = buffer;
  fileDisplayArea.innerHTML = "";
  fileDisplayArea.appendChild(image);

  image.onload = function(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    ctx.drawImage(image,0,0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    lcg.setSeed();
    console.log("seed: " + lcg.getSeed().toString());
    var randArray = new ArrayBuffer(data.length);
    var rand32 = new Uint32Array(randArray);
    for(i = 0; i < rand32.length; ++i){
        rand32[i] = lcg.rand();
    }
    var rand8 = new Uint8Array(randArray);

    // STEGO
    for(i = 0, n = data.length; i < n; i += 4) {
//       data[i] = 0;  //TEST for fiddling with individual colors
//       data[i+1] = 0;
//       data[i+2] = 0;
      for(j=0; j < 3; ++j){
        rando = rand8[ (i + j)] & 1;
        if(rando){
          data[i + j] |= rando;
        }else{
          data[i + j] &= 254;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    stegified = dataUrlToBase64(canvas.toDataURL("image/png"));
    console.log("stegified is " + typeof stegified);
    var words = CryptoJS.enc.Base64.parse(stegified);
    var sha256 = CryptoJS.SHA256(words);
    console.log("stego 1'st SHA256: " + sha256.toString());
    lamportHash( () => {
      document.getElementById('dlButton').disabled = false;
    }, sha256, rounds);
  }
}

window.onload = function() {

  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = document.getElementById('fileDisplayArea');

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var imageType = /image.*/;
    document.getElementById("register").disabled = true;
    document.getElementById('dlButton').disabled = true;
    document.getElementById('sha').value = "";
    document.getElementById('shab64').value = "";

    if (file.type.match(imageType)) {
      var reader = new FileReader();

      reader.onload = function(event) {
        var binary = event.target.result;
        stego(binary);
        var original = dataUrlToBase64(binary);
        var owords = CryptoJS.enc.Base64.parse(original);
        var osha = CryptoJS.SHA256(owords);
        console.log("original SHA256: " + osha.toString());
      }

      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });
}
