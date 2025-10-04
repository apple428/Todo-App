<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class TodoController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'priority' => 'integer|in:1,2,3',
            'notes' => 'nullable|string',
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where('user_id', $request->user()->id)
            ],
            'parent_id' => [ // Added for subtasks
                'nullable',
                'integer',
                Rule::exists('todos', 'id')->where('user_id', $request->user()->id),
                // Custom rule to ensure the parent itself is not a subtask (max depth 1)
                function ($attribute, $value, $fail) use ($request) {
                    if ($value) {
                        $parentTodo = Todo::where('id', $value)
                                          ->where('user_id', $request->user()->id)
                                          ->first();
                        if ($parentTodo && $parentTodo->parent_id !== null) {
                            $fail('Subtasks cannot have subtasks (maximum depth of 1).');
                        }
                    }
                },
            ],
        ]);

        $request->user()->todos()->create($validated);

        return Redirect::route('dashboard');
    }

    public function update(Request $request, Todo $todo)
    {
        $this->authorize('update', $todo);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'completed' => 'sometimes|boolean',
            'due_date' => 'sometimes|nullable|date',
            'priority' => 'sometimes|integer|in:1,2,3',
            'notes' => 'sometimes|nullable|string',
            'category_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where('user_id', $request->user()->id)
            ],
            'parent_id' => [ // Added for subtasks
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('todos', 'id')->where('user_id', $request->user()->id)
            ],
        ]);

        $todo->update($validated);

        return Redirect::route('dashboard');
    }

    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo);
        $todo->delete();
        return Redirect::route('dashboard');
    }
}