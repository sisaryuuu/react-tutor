<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:teacher,student',
            'course' => 'nullable|required_if:role,student|string|max:255',
        ]);

        // Only admin can create teacher accounts
        if ($validated['role'] === 'teacher' && !$request->user()->hasRole('admin')) {
            abort(403, 'Only an admin can create teacher accounts.');
        }

        $result = DB::transaction(function () use ($validated, $request) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['role'] . '123'), // teacher123 / student123
                'force_password_change' => true,
            ]);
            $user->assignRole($validated['role']);

            if ($validated['role'] === 'student') {
                $student = Student::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'course' => $validated['course'],
                    'student_id' => $this->generateStudentId(),
                    'user_id' => $user->id,
                    'teacher_id' => $request->user()->hasRole('teacher') ? $request->user()->id : null,
                ]);

                return ['user' => $user, 'student' => $student];
            }

            return ['user' => $user];
        });

        return response()->json([
            'user' => [
                'id' => $result['user']->id,
                'name' => $result['user']->name,
                'email' => $result['user']->email,
                'role' => $validated['role'],
            ],
            'student' => $result['student'] ?? null,
            'default_password' => $validated['role'] . '123',
        ], 201);
    }

    private function generateStudentId(): int
    {
        do {
            $id = random_int(10000, 99999);
        } while (Student::where('student_id', $id)->exists());

        return $id;
    }
}