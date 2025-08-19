<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Floor;
use App\Models\JadwalRuangan;
use App\Models\MatakuliahProgramStudi;
use App\Models\ProgramStudi;
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
    $prodi = ProgramStudi::with([
        // 'matakuliahProgramStudi', // nested
        'fakultas'
    ])->get();
    $buildings = Building::all();
    return Inertia::render('jadwal/index', [
        'jadwalRuangan' => $jadwalRuangan,
        'rooms' => $rooms,
        'floors' => $floors,
        'matprodi' => $matakuliahProgramStudi,
        'buildings' => $buildings,
        'prodi' => $prodi,
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
        // Validate the request data
        $request->validate([
            'rooms_id' => 'required|exists:rooms,id',
            'matakuliah_id' => 'required|exists:matakuliah_program_studi,id',
            'hari' => 'required|string|max:10',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);
        // Create the jadwal ruangan
        JadwalRuangan::create([
            'rooms_id' => $request->rooms_id,
            'matakuliah_id' => $request->matakuliah_id,
            'hari' => $request->hari,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
        ]);

        return redirect()->route('jadwal-matkul')->with('success', 'Jadwal Matakuliah berhasil ditambahkan');
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
