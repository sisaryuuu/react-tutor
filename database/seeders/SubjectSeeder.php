<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run()
{
    \App\Models\Subject::insert([
        ['name' => 'Mathematics', 'code' => 'MATH101', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Physics',     'code' => 'PHY101',  'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Chemistry',   'code' => 'CHEM101', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Biology',     'code' => 'BIO101',  'created_at' => now(), 'updated_at' => now()],
    ]);
}
}
