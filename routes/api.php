<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::get('/user', function (Request $request) {
    $user = $request->user();
    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->getRoleNames()->first(),
    ];
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('profile', [ProfileController::class, 'show']);
Route::put('profile',[ProfileController::class, 'update']);
Route::put('/profile/password', [ProfileController::class, 'changePassword']);

Route::middleware('auth:sanctum')->group(function () {
    // Anyone logged in can view
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{student}', [StudentController::class, 'show']);
    Route::get('/subjects', [SubjectController::class, 'index']);

    // Only admin + teacher can write
    Route::middleware('role:admin|teacher')->group(function () {
        Route::post('/students', [StudentController::class, 'store']);
        Route::put('/students/{student}', [StudentController::class, 'update']);
        Route::delete('/students/{student}', [StudentController::class, 'destroy']);

        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::put('/subjects/{subject}', [SubjectController::class, 'update']);
        Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);

        Route::post('/students/{student}/enroll', [SubjectController::class, 'enroll']);
        Route::delete('/students/{student}/subjects/{subject}', [SubjectController::class, 'unenroll']);

        Route::post('/users', [UserController::class, 'store']);
    });
});