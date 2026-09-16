<?php

use Illuminate\Support\Facades\Route;

// Serves the React app's entry view for every page route.
// All API/auth endpoints live in routes/api.php under /api/*,
// so this catch-all never interferes with them.
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');