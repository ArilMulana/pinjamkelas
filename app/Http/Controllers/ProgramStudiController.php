<?php

namespace App\Http\Controllers;

use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
class ProgramStudiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $prodi = ProgramStudi::all();
         return Inertia::render('prodi/index', [
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
          $validated = $request->validate([
        'kode_program_studi' => 'required|string|max:20|unique:program_studis,kode_program_studi',
        'nama_program_studi' => 'required|string|max:100',
        'fakultas_id' => 'required|exists:fakultas,id',
    ]);


        ProgramStudi::createProgramStudi($validated);

        // return redirect()->route('fakultas')->with('success', 'Program Studi berhasil ditambahkan');
        return redirect()->back()->with('success', 'Program Studi berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProgramStudi $programStudi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProgramStudi $programStudi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, $id)
{
    $validated = $request->validate([
        'nama_program_studi' => 'required|string|max:100',
    ]);

    $programStudi = ProgramStudi::findOrFail($id);

    $programStudi->update(['nama_program_studi' => $validated['nama_program_studi']]);

     return redirect()->route('fakultas')->with('success', 'Program Studi berhasil diperbarui');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $prodi = ProgramStudi::findOrFail($id);
           $prodi->delete();
         return redirect()->back()->with('success', 'Program Studi berhasil dihapus');
    }

}
