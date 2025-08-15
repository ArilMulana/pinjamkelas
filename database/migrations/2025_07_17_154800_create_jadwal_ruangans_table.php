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
        Schema::create('jadwal_ruangans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rooms_id')->constrained('rooms')->onDelete('cascade');
            $table->foreignId('matakuliah_id')->constrained('matakuliah_program_studi')->onDelete('cascade');
            $table->string('hari', 20);      // VARCHAR(20) untuk hari
            $table->time('jam_mulai');       // TIME
            $table->time('jam_selesai');
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_ruangans');
    }
};
