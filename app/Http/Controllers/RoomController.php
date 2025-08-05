<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use App\Models\Room;
use App\Models\Building;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
{
      $buildings = Building::with(['floors.rooms'])->get();

      $rooms = Room::with(['floor.building'])->get();
    return inertia('room/index', [
        'buildings' => $buildings,
        'rooms'=>$rooms,
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
            'floor_id' => 'required|exists:floors,id',
            'name' => 'required|string|max:255',
            'capacity'=>'required|integer',
        ]);
        Room::createRoom($validate);

    return redirect()->back()->with('success', 'Ruangan berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
  public function update(Request $request, Room $room)
{

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'capacity' => 'required|integer|min:1',
    ]);

    $room->update($request->only(['name', 'capacity']));
    return redirect()->route('room')->with('success', 'Ruangan berhasil diperbarui');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $rooms = Room::findOrFail($id);
        $rooms->delete();
        return redirect()->back()->with('success', 'Ruangan berhasil dihapus');
    }
}
