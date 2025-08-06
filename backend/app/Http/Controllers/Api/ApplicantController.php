<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class ApplicantController extends Controller
{
    public function index()
    {
        // $response = Http::withHeaders([
        //     'X-API-KEY' => '11er8cf3e84157109c9660f55389a8b5b3a7072dd', // Test raw first
        //     'Accept' => 'application/json',
        //     'Content-Type' => 'application/json',
        // ])->get('https://nexusphere.proweaver.tools/api/getAllApplicant');
        $response = Http::withHeaders([
            'X-API-KEY' => '11er8cf3e84157109c9660f55389a8b5b3a7072dd',
            'Accept' => 'application/json',
        ])->withOptions([
                    'verify' => false, // <-- disables SSL cert validation
                ])->get('https://nexusphere.proweaver.tools/api/getAllApplicant');

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch applicants'], $response->status());
        }

        $data = $response->json();

        $applicants = collect($data['data'] ?? [])->map(function ($item) {
            return [
                'position' => $item['applicant_team'] ?? '',
                'name' => $item['applicant_name'] ?? '',
                'date' => $item['applicant_date_added'] ?? '',
                'email' => $item['applicant_email'] ?? '',
                'contact' => $item['applicant_contact_number'] ?? '',
                'salary' => 0, // No salary from API, default 0
                'reapplicant' => isset($item['record_count']) && (int) $item['record_count'] > 1,
            ];
        })->toArray();

        $uniquePositions = collect($applicants)
            ->pluck('position')
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        $tabs = [
            ['key' => 'new', 'label' => 'New', 'count' => count($applicants), 'color' => 'bg-gray-500'],
            ['key' => 'pooling', 'label' => 'Pooling', 'count' => 0, 'color' => 'bg-orange-500'],
            ['key' => 'shortlisted', 'label' => 'Shortlisted', 'count' => 0, 'color' => 'bg-yellow-400'],
            ['key' => 'hands-on', 'label' => 'Hands-on', 'count' => 0, 'color' => 'bg-yellow-200'],
            ['key' => 'final-interview', 'label' => 'Final Interview', 'count' => 0, 'color' => 'bg-lime-300'],
            ['key' => 'job-offer', 'label' => 'Job Offer', 'count' => 0, 'color' => 'bg-green-400'],
            ['key' => 'hired', 'label' => 'Hired', 'count' => 0, 'color' => 'bg-green-700'],
        ];

        return response()->json([
            'applicants' => $applicants,
            'tabs' => $tabs,
            'uniquePositions' => $uniquePositions,
            'salaryRanges' => [
                ['value' => '0-5000', 'label' => '₱0 - ₱5,000'],
                ['value' => '5001-10000', 'label' => '₱5,001 - ₱10,000'],
                ['value' => '10001-15000', 'label' => '₱10,001 - ₱15,000'],
                ['value' => '15001-20000', 'label' => '₱15,001 - ₱20,000'],
            ]
        ]);

    }
}
