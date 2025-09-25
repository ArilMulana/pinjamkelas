<?php

namespace App\Http\Controllers;

use App\Models\NitipHewan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class NitipHewanController extends Controller
{
    public function index()
    {
        $penitipans = NitipHewan::all();
        return Inertia::render('nitip/index', ['penitipans' => $penitipans]);
    }

    public function store(Request $request)
{
    $request->validate([
        'foto_hewan' => 'required|image|max:2048',
        'jenis_hewan' => 'required|string',
        'nama_pemilik' => 'required|string',
        'email_pemilik' => 'required|email',
        'waktu_penitipan' => 'required|date',
    ]);

    // Nomor Penitipan
    $tanggal = date('ymd', strtotime($request->waktu_penitipan));
    $jenis = strtoupper($request->jenis_hewan);
    $count = NitipHewan::whereDate('waktu_penitipan', $tanggal)
        ->where('jenis_hewan', $request->jenis_hewan)
        ->count();
        
    //dd($count);
    $final = $count + 1;
    $nomor_penitipan = "{$tanggal}/{$jenis}/{$final}";

    // Upload foto
    if ($request->hasFile('foto_hewan')) {
        $path = $request->file('foto_hewan')->store('penitipan', 'public');
    }

    NitipHewan::create([
        'nomor_penitipan' => $nomor_penitipan,
        'foto_hewan' => $path ?? null,
        'jenis_hewan' => $request->jenis_hewan,
        'nama_pemilik' => $request->nama_pemilik,
        'email_pemilik' => $request->email_pemilik,
        'waktu_penitipan' => $request->waktu_penitipan,
    ]);

    return redirect()->back()->with('success', 'Data berhasil ditambahkan.');
}

    public function update(Request $request, NitipHewan $nitipHewan)
{
    $request->validate([
        'waktu_pengambilan' => 'required|date|after_or_equal:waktu_penitipan',
    ]);

    $nitipHewan->update([
        'waktu_pengambilan' => $request->waktu_pengambilan,
    ]);

    return redirect()->back()->with('success', 'Waktu pengambilan berhasil ditambahkan.');
}

    public function destroy(NitipHewan $nitipHewan)
    {
        if ($nitipHewan->foto_hewan) {
            Storage::disk('public')->delete($nitipHewan->foto_hewan);
        }

        $nitipHewan->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
