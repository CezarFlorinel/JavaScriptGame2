<?php
include __DIR__ . '/../header.php';
?>

<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/html">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="public/assets/Misc/faviconBlood.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <link rel="stylesheet" href="/css_files/style.css"> -->
    <title>Gaemus</title>
  </head>
  <body>
  <header>
    <h1>Gaemus</h1>
    </header>

  <main>
    <canvas id = "gameCanvas"> </canvas>
    <br>
  </main>

  <footer>
    LOL
  </footer>

    <script type="module" src="app/game/main.mjs"></script>
  </body>
</html>

<?php
include __DIR__ . '/../footer.php';
?>