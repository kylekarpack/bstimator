<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html" charset="utf-8">
	<title>B.S.timator</title>
	<link rel="shortcut icon" href="icon.gif">
	<link href="theme.css" rel="stylesheet">
	<link rel="stylesheet" href="style.css">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/js/bootstrap.min.js"></script>
	<script src="js.js"></script>
</head>

<body>
<div class="page-header">
  <h1>B.S.timator <small>Estimate your B.S.</small></h1>
</div>

<div id="input">
	<h2>Paste Your Essay Here:</h2>
	<textarea></textarea>
	<button id="calc" type="button" class="btn btn-primary" data-loading-text="Loading...">Calculate</button><span class="text-error">Please enter some text!</span>	
</div>

<div id="output">
	<h2>Statistics (algorithm version 0.0.1):</h2>
	<table class="table table-hover table-striped table-bordered">
		<tr><th>Metric</th><th>Value</th><th>Comparison</th></tr>
		<tr><td>Average Word Length</td><td id="wordLen">0 characters</td><td class="progress"><div class="bar" id="barWord"></div></td></tr>
		<tr><td>Average Sentence Length</td><td id="senLen">0 words</td><td class="progress"><div class="bar" id="barSen"></div></td></tr>
		<tr><td>Commas Per Sentence</td><td id="commas">0 commmas</td></td><td class="progress"><div class="bar" id="comBar"></div></td></tr>
		<tr><td>Total Bullsh*t Words</td><td id="bsCount">0 words / 0 total words</td><td class="progress"><div class="bar"><span class="badge badge-info" data-original-title="BS Words Used" data-placement="bottom" data-trigger="hover" data-content="No BS words. Wow!"></div></td></tr>
		<tr><td>Bullsh*t Words Percentage</td><td id="bsPer">0 percent</td></td><td class="progress"><div class="bar" id="barPer"></div></td></tr>
		<tr class="info"><td><b>B.S.timate</td><td id="bstimate"><p><b>0</b> is <span>your</span> BS Factor!</td></p></td><td class="progress progress-success"><div class="bar" id="bsBar"></div></td></tr>
	</table>
	<p>Name:</p> <input></input><button id="add" type="button" class="btn btn-success" data-loading-text="Loading...">Add to Database!</button>
	<br /><label><input type="checkbox"></input> Don't store my essay, just my BStimate please</label>

	<div class="clear">
		<h2>Leaderboard:</h2>
		<table class="table table-hover table-striped table-bordered">
		<tr><th>Name</th><th>BStimate</th><th>Compare</th></tr>
			<?php
				// Server credentials offline
				function get($param) {
					$file = file("config.config");
					if ($param == "host") { return trim($file[0]);
					} elseif ($param == "username") { return trim($file[1]);
					} elseif ($param == "password") { return trim($file[2]);
					} else { return false; }
				}
			
				try {
					//change these for deployment!!
					$dsn = "mysql:dbname=bstimator;host=" . get("host");
					$user = get("username");
					$pw = get("password");
					$connection = new PDO($dsn, $user, $pw);
				} catch (PDOException $e) {
					die( 'Connection failed: ' . $e->getMessage() );
				}

				foreach($connection->query('SELECT name, bstimate, essay FROM leaders ORDER BY bstimate DESC LIMIT 5;') as $row) {
					$button = ($row["essay"] != "") ? true : false; ?>
					<tr><td><?= $row['name'] ?></td>
					<td class="bstimate"><?= $row['bstimate'] ?></td>
					<td><?php
					if ($button) {
						$id = str_replace(" ", "-", $row["name"]); ?>
						<button id="<?= $id ?>" type="button" class="btn btn-primary compare" data-loading-text="Loading...">Compare to <?= $row["name"] ?>'s</button></td></tr>
					<?php } else { ?>
						<button type="button" class="btn btn-warning" disabled="disabled">Not Avaliable</button>
					<?php }
				} ?>
		</table>
	</div>

</body>
</html>