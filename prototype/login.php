<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<title>Pic PassI</title>

<link rel="stylesheet" href="style.css">
<script src="sha256.js"></script>
<script src="enc-base64.js"></script>
<script src="login.js"></script>

</head>
<body>
<?php
  $uname = $_POST['uname'];
  $path = "/var/www/html/picPass/prototype/db/app.db";
//   $path = ":memory:";
  try {
    $conn = new PDO("sqlite:" . $path);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
    die();
  }
  $sql = "SELECT `Lamport` FROM `users` WHERE `Username` = '$uname'";
  $pdo = $conn->query($sql);
  $result = $pdo->fetch();
  if($result){
    $result = --$result[0];
//     echo "<label id='n'>$result</label>";
  } else {
    echo "<strong>That Username doesn't exist</strong>";
    die();
  }
?>

<div id="page-wrapper">

  <h1>Log in with your picture</h1>
  <div>
    Select an image file:
    <input type="file" id="fileInput">
<!--  TODO: make the inputs invisible and put the info in label instead    -->
    <form action="/cgi-bin/login.cgi" method="post">
      <input type="text" id="uname" name="uname" value="<?php echo $_POST['uname']; ?>" ><br>
      <label>Nth sha256</label><label>N = </label><input id="lamport" name="lamport" value="<?php echo $result; ?>" ><br>
      <input type="textarea" id="sha" name="sha" value="" ><br>
      <label>Nth sha256 in base64</label><br>
      <input type="textarea" id="shab64" name="shab64" value="" ><br>
      <input id="login" type="submit" value="login" disabled="true">
    </form>
  </div>

</div>

</body>
</html>