<?php

use App\Http\Controllers\BuildingController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\JadwalRuanganController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\MatakuliahProgramStudiController;
use App\Http\Controllers\ProgramStudiController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Models\MatakuliahProgramStudi;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified','role:1'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    //building
    Route::post('dashboard/building/create/process',[BuildingController::class,'store'])->name('building.store');
    Route::get('dashboard/building/create',function(){
        return Inertia::render('building/create-gedung');
    })->name('create-building');
    Route::get('/dashboard/building', [BuildingController::class, 'index'])->name('building');
    Route::delete('/dashboard/building/{id}', [BuildingController::class, 'destroy'])->name('building.destroy');
    Route::get('/dashboard/building/{building}/edit', [BuildingController::class, 'edit'])->name('building.edit');
    Route::put('/dashboard/building/{building}', [BuildingController::class, 'update'])->name('building.update');
    Route::get('/dashboard/building/cek',[BuildingController::class,'cek']);

    //floor
    Route::get('/dashboard/floor',[FloorController::class,'index'])->name('floor');
    Route::post('/dasboard/floor/create/process',[FloorController::class,'store'])->name('floor.store');
    Route::delete('/dashboard/floor/{id}',[FloorController::class,'destroy'])->name('floor.destroy');
    Route::put('/dashboard/floor/{floor}',[FloorController::class,'update'])->name('floor.update');

    //room
    Route::get('/dashboard/room',[RoomController::class,'index'])->name('room');
    Route::post('/dashboard/room/create/process',[RoomController::class,'store'])->name('room.store');
    Route::put('/dashboard/room/{room}',[RoomController::class,'update'])->name('room.update');
    Route::delete('/dashboard/room/{id}',[RoomController::class,'destroy'])->name('room.destroy');

    //fakultas

    Route::get('/dashboard/fakultas',[FakultasController::class,'index'])->name('fakultas');
    Route::post('/dashboard/fakultas/create/process',[FakultasController::class,'store'])->name('fakultas.store');
    Route::delete('/dashboard/fakultas/{id}', [FakultasController::class, 'destroy'])->name('fakultas.destroy');
    Route::put('/dashboard/fakultas/{fakultas}',[FakultasController::class,'update'])->name('fakultas.update');

    //programstudi

    Route::get('/dashboard/prodi',[ProgramStudiController::class,'index'])->name('prodi');
    Route::post('/dashboard/prodi/create/process',[ProgramStudiController::class,'store'])->name('prodi.store');
    Route::delete('/dashboard/prodi/{id}',[ProgramStudiController::class,'destroy'])->name('prodi.destroy');
    Route::put('/dashboard/prodi/{prodi}',[ProgramStudiController::class,'update'])->name('prodi.update');

    //matakuliah

    Route::get('/dashboard/matkul',[MataKuliahController::class,'index'])->name('matkul');
    Route::post('/dashboard/matkul/create/process',[MataKuliahController::class,'store'])->name('matkul.store');
    Route::put('/dashboard/matkul/{matkul}',[MataKuliahController::class,'update'])->name('matkul.update');
    Route::delete('/dashboard/matkul/{id}',[MataKuliahController::class,'destroy'])->name('matkul.destroy');
    Route::post('/dashboard/matkul/import', [MataKuliahController::class, 'importExcel'])->name('matkul.import');


    //matakuliah program studi
    Route::get('/dashboard/matkul/prodi',[MatakuliahProgramStudiController::class,'index'])->name('matkul-prodi');
    Route::post('/dashboard/matkul/prodi/create/process',[MatakuliahProgramStudiController::class,'store'])->name('matkul-prodi.store');
    Route::put('/dashboard/matkul/prodi/{matakuliahProgramStudi}',[MatakuliahProgramStudiController::class,'update'])->name('matkul-prodi.update');
    Route::delete('/dashboard/matkul/prodi/{id}',[MatakuliahProgramStudiController::class,'destroy'])->name('matkul-prodi.destroy');

    //Jadwal Matakuliah
    Route::get('/dashboard/matkul/jadwal',[JadwalRuanganController::class,'index'])->name('jadwal-matkul');
    Route::post('/dashboard/matkul/jadwal/create/process',[JadwalRuanganController::class,'store'])->name('jadwal-matkul.store');

    Route::put('/dashboard/matkul/jadwal/{ruangan}',[JadwalRuanganController::class,'update'])->name('jadwal.update');
    Route::delete('/dashboard/matkul/jadwal/{id}',[JadwalRuanganController::class,'destroy'])->name('jadwal.destroy');

    //User
    Route::get('/dashboard/user',[UserController::class,'index'])->name('user');
    Route::put('/dashboard/user/{id}',[UserController::class,'update'])->name('user.update');
    Route::delete('/dashboard/user/{id}',[UserController::class,'destroy'])->name('user.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
