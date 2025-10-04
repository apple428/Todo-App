<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->date('due_date')->nullable()->after('completed');
            $table->tinyInteger('priority')->default(2)->after('due_date'); // 1: Low, 2: Medium, 3: High
            $table->text('notes')->nullable()->after('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropColumn(['due_date', 'priority', 'notes']);
        });
    }
};
