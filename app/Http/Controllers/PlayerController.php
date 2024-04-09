<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlayerRequest;
use App\Models\Player;
use App\Repositories\PlayerRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class PlayerController extends Controller
{
    public function index(PlayerRepository $playerRepository): JsonResponse
    {
        return response()->json($playerRepository->userPlayers()->toArray(), Response::HTTP_OK);
    }

    public function store(StorePlayerRequest $request, PlayerRepository $playerRepository): JsonResponse
    {
        $player = $playerRepository->create($request->validated());

        return response()->json($player->toArray(), Response::HTTP_CREATED);
    }

    public function update(StorePlayerRequest $request, PlayerRepository $playerRepository, Player $player): JsonResponse
    {
        $playerRepository->update($request->validated(), $player->id);

        return response()->json($player->toArray(), Response::HTTP_OK);
    }

    public function template(PlayerRepository $playerRepository): JsonResponse
    {
        return response()->json($playerRepository->templatePlayer()->toArray(), Response::HTTP_OK);
    }
}
