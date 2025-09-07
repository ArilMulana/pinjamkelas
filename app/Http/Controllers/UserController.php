<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $user = User::with('role:id,name')
          ->where('role_id','!=',1)
         ->get();
         $role = Role::where('id','>',1)->get();
        return Inertia::render('user/index',[
            'users'=>$user,
            'roles'=>$role
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
    public function store(UserRequest $request)
    {
       //

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, $id)
    {
        $validated = $request->validated();
        $user = User::findOrFail($id);
        $user->update($validated);

        // return response()->json([
        //     'success' => true,
        //     'message' => 'User updated successfully',
        //     'data' => $user,
        // ]);
        return redirect()->route('user')->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json([
            'success'=>true,
            'message'=>'User deleted successfully',
        ]);

    }
}
