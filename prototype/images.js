function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
window.onload = function() {

//   document.getElementById('uname').value = "<?php echo $_GET['uname']; ?>";
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
        var hex = buf2hex(binary);
        words = CryptoJS.enc.Hex.parse(hex);
        var sha256 = CryptoJS.SHA256(words);

        document.getElementById('sha').value = sha256.toString();
        document.getElementById('shab64').value = sha256.toString(CryptoJS.enc.Base64);

//         alert("sha:" + sha256 +"\nhexdump:" + hex);
      }

      IMGreader.onload = function(event) {
        fileDisplayArea.innerHTML = "";
        var binary = event.target.result;
        var img = new Image();
        img.src = binary;
        fileDisplayArea.appendChild(img);
      }

      reader.readAsArrayBuffer(file);
      IMGreader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });

}
/*
var reader = new FileReader();

reader.onload = function(e) {
  fileDisplayArea.innerHTML = "";

  var img = new Image();
  img.src = reader.result;

  fileDisplayArea.appendChild(img);*/