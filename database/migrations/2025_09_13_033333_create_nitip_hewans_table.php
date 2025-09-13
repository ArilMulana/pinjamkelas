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
        Schema::create('nitip_hewans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_penitipan')->unique();
            $table->string('foto_hewan')->nullable();
            $table->string('jenis_hewan');
            $table->string('nama_pemilik');
            $table->string('email_pemilik');
            $table->string('waktu_penitipan');
            $table->string('waktu_pengambilan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nitip_hewans');
    }
};
