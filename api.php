<?php

//change these for deployment!!
$dsn = "mysql:dbname=bstimator;host=localhost";
$user = "root";
$pw = "bstimator";
$dbh = new PDO($dsn, $user);
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$name = $_POST["name"];
	$score = $_POST["score"];
	$essay = $_POST["essay"];
	
	$data = array($name, $score, $essay);
	$stmt = $dbh->prepare("INSERT IGNORE INTO leaders (name, bstimate, essay) VALUES (?, ?, ?)");
	$stmt->execute($data);

} elseif (isset($_GET["essay"])) {
	header("Content-Type:text/plain");
	$essayToGet = str_replace("-", " ", $_GET["essay"]);
	$stmt = $dbh->prepare("SELECT essay FROM leaders WHERE name = :name;");
	$stmt->bindParam(':name', $essayToGet);
	$stmt->execute();
	$results = $stmt->fetch();
	$results = array_map("utf8_encode", $results);
	echo json_encode($results);
}

?>