function dataUrlToBase64 (dataURL){
  return dataURL = dataURL.split(",").pop();
}

//TESTING: workaround for canvas drawing in steg function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function lamportHash(hash, rnd, pin){
  var tempstr = hash.toString();
  for(i = 1; i < rnd; i++){
    hash = CryptoJS.SHA256(tempstr);
//     hash = CryptoJS.HmacSHA256(tempstr, pin);
    tempstr = hash.toString();
    console.log(tempstr);
  }
  document.getElementById('sha').value = hash.toString();
  document.getElementById('shab64').value = hash.toString(CryptoJS.enc.Base64);
  document.getElementById('login').disabled = false; //TODO: move to a callback
}

window.onload = function() {
  var rounds = document.getElementById("lamport").value; // n for lamportHash
  var fileInput = document.getElementById('fileInput');

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
      var reader = new FileReader();

      reader.onload = async function(event) {
        var binary = event.target.result;
        var b64 = dataUrlToBase64(binary);
        var words = CryptoJS.enc.Base64.parse(b64);
        var pin = document.getElementById('pin').value.toString();
        alert("pin: " + pin);
        var sha256 = CryptoJS.HmacSHA256(words, pin);
//         var sha256 = CryptoJS.SHA256(words);
        console.log("1'st SHA256: " + sha256.toString());
        lamportHash(sha256, rounds, pin);
      }

      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });
}
