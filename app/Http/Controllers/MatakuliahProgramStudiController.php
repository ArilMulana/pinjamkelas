<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use App\Models\MataKuliah;
use App\Models\MatakuliahProgramStudi;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatakuliahProgramStudiController extends Controller
{
    public function index(){
        $fakultas = Fakultas::all();
        $matkul = MataKuliah::select('id', 'kode_matakuliah','nama_matakuliah','sks','tipe')->get();
        $prodi = ProgramStudi::with('fakultas:id,kode_fakultas,nama_fakultas')->get();
        $matprodi = MatakuliahProgramStudi::with([
            'programstudi:id,kode_program_studi,nama_program_studi,fakultas_id',
            'matakuliah:id,kode_matakuliah,nama_matakuliah,sks,tipe'
        ])->get();
        return Inertia::render('matkul/prodi/index', [
            'matkulData' => $matkul,
            'prodi' => $prodi,
            'fakultas'=> $fakultas,
            'matprodi'=>$matprodi
         ]);
    }

      public function store(Request $request)
    {
          $validated = $request->validate([
        'program_studi_id' => 'required|exists:program_studis,id',
        'matakuliah_id' => 'required|exists:mata_kuliahs,id',
      ]);


        MatakuliahProgramStudi::createMatkulProdi($validated);

        // return redirect()->route('fakultas')->with('success', 'Program Studi berhasil ditambahkan');
        return redirect()->back()->with('success', 'Program Studi berhasil ditambahkan');
    }



}
