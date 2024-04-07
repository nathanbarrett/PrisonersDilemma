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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class)->nullable();
            $table->string('name');
            $table->mediumText('description')->nullable();
            $table->longText('ts_code');
            $table->boolean('is_system')->default(false);
            $table->boolean('is_public')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_template')->default(false);
            $table->json('tournament_rule_requirements');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
