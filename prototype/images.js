var rounds = 1000000; //original n for lamportHash

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

//TESTING: Don't need this function anymore but it will detect bad Base64
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
function base64_decode(input) {
  var output = new Array();
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;

  var orig_input = input;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  if (orig_input != input)
    alert ("Warning! Characters outside Base64 range in input string ignored.");
  if (input.length % 4) {
    alert ("Error: Input length is not a multiple of 4 bytes.");
    return "";
  }

  var j=0;
  while (i < input.length) {

    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output[j++] = chr1;
    if (enc3 != 64)
      output[j++] = chr2;
    if (enc4 != 64)
      output[j++] = chr3;

  }
  return output;
}

//TESTING: Experimenting with async function
function saveCanvas(imageData){
  return new Promise(context.putImageData(imageData, 0, 0));
}

//TESTING: workaround for canvas drawing in steg function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function lamportHash(hash, rnd){
  for(i = 1; i < rnd; i++){
    hash = CryptoJS.SHA256(hash);
  }
  document.getElementById('sha').value = hash.toString();
  document.getElementById('shab64').value = hash.toString(CryptoJS.enc.Base64);
  document.getElementById('download').disabled = false; //TODO: move to a callback
}

function stego(buffer) { // buffer is dataURL
  // randomisation for STEGO
  var rando = 1;  // Use a secure random function to flip between 0 & 1 each time it's used
  var b64 = dataUrlToBase64(buffer);
  var words = CryptoJS.enc.Base64.parse(b64);
  var key = new Date().getTime();  // timestamp in milliseconds
  var cipherText = CryptoJS.RC4Drop.encrypt(words, key.toString());
  var image = new Image();

  image.src = buffer;
  fileDisplayArea.innerHTML = "";
  fileDisplayArea.appendChild(image);

  image.onload = function(){
    document.getElementById("register").disabled = true;
    document.getElementById('download').disabled = true;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image,0,0);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    // STEGO
    for(var i = 0, n = data.length; i < n; i += 4) {
      rando = cipherText[i] & 1;
      data[i] ^= rando;
      rando = cipherText[i] & 2;
      data[i + 1] ^= rando;
      rando = cipherText[i] & 4;
      data[i + 2] ^= rando;
      rando = cipherText[i] & 8;
      data[i + 3] ^= rando;
    }
    console.log("ping");
    ctx.putImageData(imageData, 0, 0);
    console.log("pong");
    console.log("get");
    stegified = dataUrlToBase64(canvas.toDataURL("image/png"));
    console.log("some");
    console.log("fu");
  }
  console.log("bar")
}

window.onload = function() {

  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = document.getElementById('fileDisplayArea');

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
      var reader = new FileReader();

      reader.onload = async function(event) {
        var binary = event.target.result;
        stego(binary);
        await sleep(2000);
        console.log("ballz");
        var original = dataUrlToBase64(binary);
        var owords = CryptoJS.enc.Base64.parse(original);
        console.log("stegified is " + typeof stegified);
        var words = CryptoJS.enc.Base64.parse(stegified);
        var sha256 = CryptoJS.SHA256(words);
        console.log("stego 1'st SHA256: " + sha256.toString());
        var osha = CryptoJS.SHA256(owords);
        console.log("original SHA256: " + osha.toString());
        lamportHash(sha256, rounds);
      }

      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });

}
