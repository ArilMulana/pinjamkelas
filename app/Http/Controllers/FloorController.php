<?php

namespace App\Http\Controllers;

use App\Http\Requests\FloorRequest;
use App\Models\Floor;
use App\Services\DataCheckerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;
use Illuminate\Validation\Rule;

class FloorController extends Controller
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
        $buildings = Building::select('id', 'name','code','lokasi')->get();
        $floors = Floor::with('building:id,name,lokasi,code')->get();
        return Inertia::render('floor/index', [
            'buildings' => $buildings,
            'floors' => $floors,
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
    public function store(FloorRequest $request)
    {
       $validated = $request->validated();

        Floor::createFloor($validated);

        return redirect()->route('floor')->with('success', 'Gedung berhasil ditambahkan');
    }
    /**
     * Display the specified resource.
     */
    public function show(Floor $floor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,floor $floor)
    {
        $validated = $request->validated();
        $floor->update($validated);
         return redirect()->route('floor')->with('success', 'Lantai berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $floors = Floor::findOrFail($id);
        $floors->delete();
         return redirect()->back()->with('success', 'Lantai berhasil dihapus');
    }

    public function cek(Request $request)
    {
         $request->validate([
        'building_id' => 'required|integer|exists:buildings,id',
        'floor_number' => 'required|integer',
        ]);

        $exists = Floor::where('building_id', $request->building_id)
                    ->where('floor_number', $request->floor_number)
                    ->exists();

        return response()->json(['exists' => $exists]);
    }
}
