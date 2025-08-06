<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add this line

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // Add HasApiTokens to the trait list

    protected $fillable = [
        'first_name',
        'last_name',
        'fullname',
        'alias',
        'email',
        'user_type',
        'team_id',
        'team_name',
        'sub_team_id',
        'sub_team_name',
        'designation',
        'department',
        'phone',
        'address',
        'birthdate',
        'gender',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
