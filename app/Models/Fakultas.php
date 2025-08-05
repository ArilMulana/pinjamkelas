<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fakultas extends Model
{
     protected $fillable = ['kode_fakultas','nama_fakultas'];
     public $timestamps= false;
     public static function createFakultas(array $data){
        return self::create($data);
     }

       public function programStudis()
    {
        return $this->hasMany(ProgramStudi::class, 'fakultas_id');  // 'fakultas_id' adalah kolom foreign key di program_studi
    }
}
