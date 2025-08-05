<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Fakultas;
class FakultasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          Fakultas::insert([
            ['kode_fakultas' => 'FBS', 'nama_fakultas' => 'Fakultas Bahasa dan Seni'],
            ['kode_fakultas' => 'FMIPA', 'nama_fakultas' => 'Fakultas Matematika dan Ilmu Pengetahuan Alam'],
            ['kode_fakultas' => 'FTIK', 'nama_fakultas' => 'Fakultas Teknik dan Ilmu Komputer '],
            ['kode_fakultas' =>'FIPPS','nama_fakultas'=>'Fakultas Ilmu Pendidikan dan Pengetahuan Sosial']
        ]);
    }
}
