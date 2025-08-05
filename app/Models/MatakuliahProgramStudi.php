<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class MatakuliahProgramStudi extends Model
{
     public $timestamps= false;
     protected $table = 'matakuliah_program_studi';
    protected $fillable = ['program_studi_id','matakuliah_id'];

    public static function createMatkulProdi(array $data){
        // $data['code'] = strtoupper($data['code']);

        return self::create($data);
    }
      public function matakuliah()
    {
        return $this->belongsTo(MataKuliah::class,'matakuliah_id');
    }

    public function programstudi()
    {
        return $this->belongsTo(ProgramStudi::class,'program_studi_id');
    }
}
