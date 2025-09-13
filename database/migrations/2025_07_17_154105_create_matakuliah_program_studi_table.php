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
        Schema::create('matakuliah_program_studi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_studi_id');
            $table->unsignedBigInteger('matakuliah_id');

            $table->foreign('program_studi_id')->references('id')->on('program_studis')->onDelete('cascade');
            $table->foreign('matakuliah_id')->references('id')->on('mata_kuliahs')->onDelete('cascade');

            $table->unique(['program_studi_id', 'matakuliah_id']); // mencegah duplikasi
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matakuliah_program_studi');
    }
};
