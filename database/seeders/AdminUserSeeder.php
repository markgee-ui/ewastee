<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@etaka.com'], // Unique identifier (prevents duplicate creation)
            [
                'name' => 'Administrator',
                'email' => 'admin@etaka.com', // Explicit (recommended for clarity)
                'password' => Hash::make('securepassword'), // Hash password
                'role' => 'admin'
            ]
        );
    }
}
