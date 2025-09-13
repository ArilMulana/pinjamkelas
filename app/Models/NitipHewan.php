<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NitipHewan extends Model
{
     protected $fillable = ['nomor_penitipan','foto_hewan','jenis_hewan','nama_pemilik','email_pemilik','waktu_penitipan','waktu_pengambilan'];
    public static function createNitip(array $data){
        //$data['code'] = strtoupper($data['code']);
        return self::create($data);
    }
}
