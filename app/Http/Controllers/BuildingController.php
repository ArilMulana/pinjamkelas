<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBuildingRequest;
use App\Models\Building;
use App\Services\DataCheckerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $checker;

       public function __construct(DataCheckerService $checker)
    {
        $this->checker = $checker;
    }

    public function index()
    {
        $gedung = Building::all();

        return Inertia::render('building/index', [

        'gedungs' => $gedung,
        // bisa juga kirim data lain misal flash message dsb
         ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(array $data)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBuildingRequest $request)
    {
        $validated = $request->validated();

        $building =Building::createBuilding($validated);
    //  return redirect()->route('building')->with('success', 'Gedung berhasil ditambah');
    return redirect()->route('building');

    }

    /**
     * Display the specified resource.
     */
    public function show(Building $building)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Building $building)
    {
        return inertia('Building/Edit', [
        'building' => $building,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Building $building)
    {
        $validated = $request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:50',
        'lokasi' => 'required|string|max:255',
    ]);

    // Update data gedung
    $building->update($validated);

    // Redirect kembali dengan pesan sukses
    return redirect()->route('building')->with('success', 'Gedung berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $building = Building::findOrFail($id);
        $building->delete();
        return redirect()->back()->with('success', 'Gedung berhasil dihapus');
    }

     public function cek(Request $request)
    {
        $request->validate(['value' => 'required|string']);
        $value = $request->input('value');

        $exists = $this->checker->cekData(new Building(), 'code', $value);

        return response()->json(['exists' => $exists]);
    }
}
