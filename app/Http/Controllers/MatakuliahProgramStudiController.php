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
        'matakuliah_ids' => 'required|array',
        'matakuliah_ids.*' => 'exists:mata_kuliahs,id',
    ]);

    $programStudi = ProgramStudi::findOrFail($validated['program_studi_id']);

    // tambahkan matakuliah ke pivot tanpa menghapus yang lama
    $programStudi->mataKuliahs()->syncWithoutDetaching($validated['matakuliah_ids']);
    return redirect()->back()->with('success', 'Program Studi berhasil ditambahkan');
    }

    public function update(Request $request,$id)
    {
        $validated = $request->validate([
            'program_studi_id' => 'required|exists:program_studis,id',
            'matakuliah_id' => 'required|exists:mata_kuliahs,id',
        ]);
        $matakuliahProgramStudi = MatakuliahProgramStudi::findOrFail($id);
        $matakuliahProgramStudi->update($validated);

        return redirect()->back()->with('success', 'Data Matakuliah Program Studi berhasil diperbarui');
    }
    public function destroy($id)
    {
        $matakuliahProgramStudi = MatakuliahProgramStudi::findOrFail($id);
        $matakuliahProgramStudi->delete();

        return redirect()->back()->with('success', 'Data Matakuliah Program Studi berhasil dihapus');
    }

}
