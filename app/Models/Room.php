<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /**
     * Get the user that owns the Room
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public $timestamps= false;
    protected $fillable = ['floor_id','name','capacity','is_active'];

     public static function createRoom(array $data){
        // $data['code'] = strtoupper($data['code']);
        $data['is_active'] = 1;
        return self::create($data);
    }
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }
}
