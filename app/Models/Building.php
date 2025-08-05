<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    public $timestamps= false;
    protected $fillable = ['name','code','lokasi'];

    public static function createBuilding(array $data){
        $data['code'] = strtoupper($data['code']);
        return self::create($data);
    }

    public function floors()
   {
    return $this->hasMany(Floor::class);
    }
}
