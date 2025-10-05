<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\CategoryController; // Import CategoryController
use App\Models\Todo;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request; // Import Request
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function (Request $request) {
    $query = Todo::with(['category', 'children', 'parent'])->where('user_id', auth()->id());

    // Filter by completion status
    if ($request->query('status') === 'completed') {
        $query->where('completed', true);
    } elseif ($request->query('status') === 'active') {
        $query->where('completed', false);
    }

    // Filter by category
    if ($request->query('category')) {
        $query->where('category_id', $request->query('category'));
    }

    // Sorting
    $sortBy = $request->query('sort_by', 'created_at');
    $sortOrder = $request->query('sort_order', 'desc');

    if (in_array($sortBy, ['created_at', 'due_date', 'priority', 'title'])) {
        $query->orderBy($sortBy, $sortOrder);
    }

    return Inertia::render('Dashboard/index', [
        'todos' => $query->get(),
        'categories' => $request->user()->categories()->get(),
        'filters' => $request->only(['status', 'sort_by', 'sort_order', 'category'])
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('todos', TodoController::class)->except(['show', 'edit', 'create']);
    Route::apiResource('categories', CategoryController::class);
});

require __DIR__.'/auth.php';
