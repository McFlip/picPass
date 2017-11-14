<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<title>Pic PassI</title>

<link rel="stylesheet" href="style.css">
<script src="sha256.js"></script>
<script src="enc-base64.js"></script>
<script src="images.js"></script>

</head>
<body>
<div id="page-wrapper">

  <h1>Image File Reader</h1>
<!--   <div><?php print_r($_POST) ?></div> -->
  <div>
    Select an image file:
    <input type="file" id="fileInput">
    <form action="register.py" method="get">
    <input type="text" disabled="true" id="uname" name="uname" value = "<?php echo $_POST['uname']; ?>" ><br>
    <input type="textarea" disabled="true" id="sha" name="sha" value="" ><br>
    <input type="textarea" disabled="true" id="shab64" name="shab64" value="" ><br>
    <input type="submit" value="register">
    </form>
  </div>
  <div id="fileDisplayArea"></div>

</div>

</body>
</html>