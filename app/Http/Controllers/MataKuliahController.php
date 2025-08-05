<?php

namespace App\Http\Controllers;

use App\Imports\MatkulImport;
use App\Models\Fakultas;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;

class MataKuliahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

            $query = Matakuliah::query();

            // ✨ Optional: filter pencarian
            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where('nama_matakuliah', 'like', "%$search%");
            }

            // ✨ Optional: sorting
            if ($request->has('sort_by') && $request->has('sort_dir')) {
                $query->orderBy($request->get('sort_by'), $request->get('sort_dir'));
            }

            // ✨ Pagination (default 10 per page)
            $perPage = $request->get('per_page', 50);
            $matkul = $query->paginate($perPage)->withQueryString();
            //   $matkul = $query->get();
            $fakultas = Fakultas::all();
            $prodi = ProgramStudi::all();
            //dd($tipe);
            return Inertia::render('matkul/index', [
                'matkul' => $matkul,
                'filters' => $request->only(['search', 'sort_by', 'sort_dir']),
                'fakultas'=>$fakultas,
                'prodi'=>$prodi,
            ]);


            }


    /**
     * Show the form for creating a new resource.
     */

    public function importExcel(Request $request)
{
      $request->validate([
        'file_excel' => 'required|file|mimes:xlsx,xls,csv',
    ]);
    try {
        Excel::import(new MatkulImport, $request->file('file_excel'));
    } catch (ValidationException $e) {
        // Log error untuk debugging
        Log::error('Import Validation Failed', [
            'errors' => $e->failures(),
        ]);

        return back()->withErrors($e->failures());
    } catch (\Throwable $e) {
        // Catch semua error lainnya
        Log::error('Import Failed: ' . $e->getMessage());

        return back()->withErrors(['file_excel' => 'Terjadi kesalahan saat import: ' . $e->getMessage()]);
    }

      return redirect()->route('matkul')->with('success', 'Matakuliah berhasil ditambahkan');
}
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
            'kode_matakuliah'=>'required|string|max:20|unique:mata_kuliahs,kode_matakuliah',
            'nama_matakuliah'=>'required|string|max:100',
            'sks'=>'required|numeric',
            'tipe'=>'required|in:wajib,umum'
        ]);
        MataKuliah::createMatkul($validated);

     return redirect()->route('matkul')->with('success', 'Matakuliah berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(MataKuliah $mataKuliah)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MataKuliah $mataKuliah)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {


        $validated = $request->validate([
            'kode_matakuliah' => 'required|string|max:20|unique:mata_kuliahs,kode_matakuliah,' . $id,
            'nama_matakuliah' => 'required|string|max:100',
            'sks' => 'required|numeric',
            'tipe' => 'required|in:wajib,umum',
        ]);

         $matkul = MataKuliah::findOrFail($id);
        $matkul->update($validated);

    return redirect()->route('matkul')->with('success', 'Matakuliah berhasil diperbarui');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
            $matkul = MataKuliah::findOrFail($id);
        $matkul->delete();
        return redirect()->back()->with('success', 'Matakuliah berhasil dihapus');
    }

  public function cek(Request $request){
    $request->validate([
        'value' => 'required|string'
    ]);

    $kode = $request->query('value');
    $ada = MataKuliah::where('kode_matakuliah', $kode)->exists();

    return response()->json(['exists' => $ada]);
}

}
