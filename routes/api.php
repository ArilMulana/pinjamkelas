<?php

use App\Events\UserNotification;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\JadwalRuanganController;
use App\Http\Controllers\MataKuliahController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified','role:1'])->group(function () {

    //API Jadwal
      Route::post('/cek-jadwal-bentrok', [JadwalRuanganController::class, 'cek']);

      //API Matakuliah
      Route::get('/dashboard/matkul/cek-matakuliah', [MataKuliahController::class, 'cek']);

      //API Cek Code gedung
     Route::get('/dashboard/building/cek',[BuildingController::class,'cek']);

     //API Cek Lantai

     Route::get('/dashboard/floor/cek-floor',[FloorController::class,'cek']);
});

?>
