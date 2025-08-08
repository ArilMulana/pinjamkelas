<?php

namespace App\Http\Controllers;

use App\Models\JadwalRuangan;
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
        $jadwalRuangan = JadwalRuangan::all(); // Example, adjust as needed
        return Inertia::render('jadwal/index', [
            'jadwalRuangan' => $jadwalRuangan,
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
