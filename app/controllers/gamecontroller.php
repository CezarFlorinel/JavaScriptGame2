<?php
namespace App\Controllers;

class GameController
{
    private $gameService;

    function __construct()
    {
       // $this->gameService = new \App\Services\GameService();
    }

    public function index()
    {
      //  $model = $this->gameService->getAll();
      require __DIR__ . '/../views/game/index.php';

    }

}


?>