function download(){
  var download = document.getElementById("download");
  var image = document.getElementById("canvas").toDataURL("image/png")
  .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
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

function stego(buffer) { // buffer is dataURL
  // randomisation for STEGO
  var rando = 1;  // Use a secure random function to flip between 0 & 1 each time it's used
  var b64 = dataUrlToBase64(buffer);
  var words = CryptoJS.enc.Base64.parse(b64);
  var key = new Date().getTime();  // timestamp in milliseconds
  var cipherText = CryptoJS.RC4Drop.encrypt(words, key.toString());
  var canvas = document.getElementById("canvas");
  var ctx=canvas.getContext("2d");
  var image = new Image();
  image.src = buffer;
  fileDisplayArea.innerHTML = "";
  fileDisplayArea.appendChild(image);
  image.onload = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.height = image.height;
  canvas.width = image.width;
  ctx.drawImage(image,0,0);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;

  // STEGO
  for(var i = 0, n = data.length; i < n; i += 4) {
//       data[i] ^= rando;
    data[i] = 0;
    data[i + 1] ^= rando;
//       data[i + 2] ^= rando;
    data[i + 2] = 255;
    data[i + 3] ^= rando;
  }
  ctx.putImageData(imageData, 0, 0);
  }

  return dataUrlToBase64(canvas.toDataURL("image/png"));
}

window.onload = function() {

  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = document.getElementById('fileDisplayArea');

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
      var reader = new FileReader();
      var IMGreader = new FileReader();

      reader.onload = function(event) {
        var binary = event.target.result;
        var b64 = stego(binary);
        var original = dataUrlToBase64(binary);
        var owords = CryptoJS.enc.Base64.parse(original);
        var words = CryptoJS.enc.Base64.parse(b64);
        var sha256 = CryptoJS.SHA256(words);
        var osha = CryptoJS.SHA256(owords);
        alert(osha.toString());

        document.getElementById('sha').value = sha256.toString();
        document.getElementById('shab64').value = sha256.toString(CryptoJS.enc.Base64);
      }

      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });

}
