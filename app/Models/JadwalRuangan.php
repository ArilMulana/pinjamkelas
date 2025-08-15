<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalRuangan extends Model
{
     public $timestamps= false;
    protected $fillable = ['rooms_id','matakuliah_id','hari','jam_mulai','jam_selesai'];

    public static function createJadwal(array $data){
        return self::create($data);
    }

    public function rooms()
{
    return $this->belongsTo(Room::class, 'rooms_id');
}

    public function matakuliah(){
        return $this->belongsTo(MatakuliahProgramStudi::class, 'id', 'matakuliah_id');
    }

    public function matakuliah_program_studi()
{
    return $this->belongsTo(MatakuliahProgramStudi::class, 'matakuliah_id');
}
}
