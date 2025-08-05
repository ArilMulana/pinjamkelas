<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramStudi extends Model
{
    protected $fillable = ['kode_program_studi','nama_program_studi','fakultas_id'];
    public $timestamps = false;
    public static function createProgramStudi(array $data){
        return self::create($data);
    }

      public function fakultas(){
          return $this->belongsTo(Fakultas::class, 'fakultas_id');
    }
       public function matakuliahProgramStudi()
    {
        return $this->hasMany(MatakuliahProgramStudi::class);
    }
}
