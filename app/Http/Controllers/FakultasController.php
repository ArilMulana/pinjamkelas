<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Inertia\Inertia;
class FakultasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fakultas = Fakultas::all();
         $prodi = ProgramStudi::with('fakultas')->get();
         return Inertia::render('fakultas/index', [
        'fakultas' => $fakultas,
        'prodi'=>$prodi
        // bisa juga kirim data lain misal flash message dsb
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
         $validate =  $request->validate([
            'kode_fakultas' => 'required|string|max:20',
            'nama_fakultas' => 'required|string|max:100',
        ]);
        Fakultas::createFakultas($validate);
        return redirect()->route('fakultas')->with('success', 'Fakultas berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Fakultas $fakultas)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fakultas $fakultas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fakultas $fakultas)
    {
         $validate =  $request->validate([
            'kode_fakultas' => 'required|string|max:20',
            'nama_fakultas' => 'required|string|max:100',
        ]);

        $fakultas->update($validate);
        return redirect()->route('fakultas')->with('success', 'Fakultas berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
           $fakultas = Fakultas::findOrFail($id);
           $fakultas->delete();
         return redirect()->back()->with('success', 'Fakultas berhasil dihapus');
    }
}
