<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
     public $timestamps= false;
    protected $fillable = ['building_id','floor_number'];
     public static function createFloor(array $data){
        // $data['code'] = strtoupper($data['code']);
        return self::create($data);
    }

     public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function rooms(){
        return $this->hasMany(Room::class);
    }
}
