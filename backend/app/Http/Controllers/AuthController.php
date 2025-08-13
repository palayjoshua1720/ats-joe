<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // External API call
        $response = Http::withHeaders([
            'TOOLKEYAPI' => '11e7cf3e84157109c9660f55389a8b5b3a6062bb',
        ])->asForm()->post('https://vincent-api.proweaver.app/orchestra/toolslogin', [
                    'useremail' => $request->email,
                    'password' => $request->password,
                ]);

        $result = $response->json();

        if (!isset($result['data']['form_status']) || !$result['data']['form_status']) {
            return response()->json([
                'message' => $result['data']['form_message'] ?? 'Invalid credentials'
            ], 401);
        }

        $data = $result['data']['data'] ?? [];

        // Authorization logic
        $allowedEmails = array_merge(
            ['joeventulan@proweaver.net', 'jospalay@proweaver.net'],
            ['hyatriba@prowe.net', 'jupb@prowe.net', 'julmelenc@prowe.net', 'reytahadlangit@prowe.net', 'theavila@prowe.net'],
            config('app.developers', [])
        );

        $allowedSubTeams = [59, 53];

        if (!in_array($data['user_email'], $allowedEmails) && !in_array($data['sub_team_id'], $allowedSubTeams)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check or create user in Laravel's local users table
        $user = User::firstOrCreate(
            ['email' => $data['user_email']],
            [
                'name' => $data['alias'] ?? $data['user_email'],
                'first_name' => $data['first_name'] ?? 'Unknown',
                'last_name' => $data['last_name'] ?? '',
                'fullname' => $data['name'] ?? 'Unknown',
                'alias' => $data['alias'] ?? 'Unknown',
                'user_type' => $data['user_type'] ?? 'Unknown',
                'team_id' => $data['team_id'] ?? 'Unknown',
                'team_name' => $data['team_name'] ?? 'Unknown',
                'sub_team_id' => $data['sub_team_id'] ?? 'Unknown',
                'sub_team_name' => $data['sub_team_name'] ?? 'Unknown',
                'designation' => $data['hr_designation'] ?? 'Unknown',
                'department' => $data['hr_department'] ?? 'Unknown',
                'password' => Hash::make(uniqid()),
            ]
        );

        // Issue Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'email' => $user->email,
                'name' => $user->name,
            ],
        ]);
    }

  public function verifyKeycode(Request $request)
{
    $request->validate([
        'keycode' => 'required|string',
    ]);

    $url = 'https://vincent-api.proweaver.app/orchestra/toolskeycode';
    $apiKey = '11e7cf3e84157109c9660f55389a8b5b3a6062bb';

    $ch = curl_init();
    $postfields = [
        'keycode' => $request->keycode
    ];

    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['TOOLKEYAPI:' . $apiKey]);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $res = curl_exec($ch);
    curl_close($ch);

    // Match CI behavior: expecting literal 'true'
    if (trim($res) === 'true') {
        return response()->json([
            'verified' => true,
            'message' => 'Login success'
        ]);
    } else {
        return response()->json([
            'verified' => false,
            'message' => 'Invalid keycode, please try again.'
        ], 400);
    }
}


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
