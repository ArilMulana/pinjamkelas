<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Floor;
use App\Models\JadwalRuangan;
use App\Models\MatakuliahProgramStudi;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalRuanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Logic to retrieve and display the jadwal ruangan
        $jadwalRuangan = JadwalRuangan::with([
        'rooms.floor.building', // nested: rooms → floor → building
        'matakuliah_program_studi.matakuliah', // nested
        'matakuliah_program_studi.programstudi' // nested
    ])->get();
        $rooms = Room::with([
        'floor.building', // nested: floor → building
    ])->get();
        $floors = Floor::with([
        'building', // nested: floor → building
    ])->get();
        $matakuliahProgramStudi = MatakuliahProgramStudi::with([
        'matakuliah', // nested
        'programstudi' // nested
    ])->get();
    $buildings = Building::all();
    return Inertia::render('jadwal/index', [
        'jadwalRuangan' => $jadwalRuangan,
        'rooms' => $rooms,
        'floors' => $floors,
        'matakuliahProgramStudi' => $matakuliahProgramStudi,
        'buildings' => $buildings,
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(JadwalRuangan $jadwalRuangan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JadwalRuangan $jadwalRuangan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JadwalRuangan $jadwalRuangan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JadwalRuangan $jadwalRuangan)
    {
        //
    }
}
