<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
       public $timestamps= false;
    protected $fillable = ['kode_matakuliah','nama_matakuliah','sks','tipe'];

     public static function createMatkul(array $data){
        $data['kode_matakuliah'] = strtoupper($data['kode_matakuliah']);
        return self::create($data);
    }

      public function matakuliahProgramStudi()
    {
        return $this->hasMany(MatakuliahProgramStudi::class);
    }

}
