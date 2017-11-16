function download(){
  var download = document.getElementById("download");
  var image = document.getElementById("canvas").toDataURL("image/png")
  .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}
// function hexToBase64(str) {
//   return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
// }
function dataUrlToBase64 (dataURL){
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function stego(buffer) { // buffer is an ArrayBuffer
  // hex will be fed into the word encoding function
//   var hex = Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  var rando = 1;  //TODO: Use a secure random function to flip between 0 & 1 each time it's used
  var canvas = document.getElementById("canvas");
  var ctx=canvas.getContext("2d");
  var image = new Image();
//   image.src = 'data:image/jpeg;base64,' + hexToBase64(hex);
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
      data[i] ^= rando;
      data[i + 1] ^= rando;
      data[i + 2] ^= rando;
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
        var words = CryptoJS.enc.Base64.parse(b64);
        var sha256 = CryptoJS.SHA256(words);

        document.getElementById('sha').value = sha256.toString();
        document.getElementById('shab64').value = sha256.toString(CryptoJS.enc.Base64);
      }

      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });

}
