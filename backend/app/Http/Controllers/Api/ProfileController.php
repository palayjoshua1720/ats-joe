<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            ['name' => 'Joey Ventulan', 
                   'hobbies' =>
                    ['Play Intruments',
                     'Long rides',
                     'Watching Movies',
                     ]]);
    }
    
} 