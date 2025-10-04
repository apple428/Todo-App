<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'completed',
        'user_id',
        'due_date',
        'priority',
        'notes',
        'category_id',
        'parent_id', // Added for subtasks
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Define the parent relationship for subtasks
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Todo::class, 'parent_id');
    }

    // Define the children relationship for subtasks
    public function children(): HasMany
    {
        return $this->hasMany(Todo::class, 'parent_id');
    }
}
