<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;
use Illuminate\Validation\Rule;

class FloorController extends Controller
{
    /**
     * Display a listing of the resource.
     */


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
    public function store(Request $request)
    {
       $validated = $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'floor_number' => [
                'required',
                Rule::unique('floors')->where(function ($query) use ($request) {
                    return $query->where('building_id', $request->input('building_id'));
                }),
            ],
        ]);

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
        $validated = $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'floor_number' => [
                'required',
                Rule::unique('floors')->where(function ($query) use ($request) {
                    return $query->where('building_id', $request->input('building_id'));
                }),
            ],
        ]);
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
}
