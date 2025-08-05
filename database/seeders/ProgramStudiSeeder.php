<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProgramStudi;
class ProgramStudiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProgramStudi::insert([
            ['kode_program_studi' => 'FTIK01', 'nama_program_studi' => 'Teknik Informatika','fakultas_id'=>3],
            ['kode_program_studi' => 'FTIK02', 'nama_program_studi' => 'Arsitektur','fakultas_id'=>3],
            ['kode_program_studi' => 'FTIK03', 'nama_program_studi' => 'Teknik Industri','fakultas_id'=>3],
            ['kode_program_studi' =>'FTIK04','nama_program_studi' => 'Sistem Informasi','fakultas_id'=>3],
            ['kode_program_studi' => 'FBS01', 'nama_program_studi' => 'Pendidikan Bahasa Inggris','fakultas_id'=>1],
            ['kode_program_studi' => 'FBS02', 'nama_program_studi' => 'Pendidikan Bahasa dan Sastra Indonesia ','fakultas_id'=>1],
            ['kode_program_studi' => 'FBS03', 'nama_program_studi' => 'Desain Komunikasi Visual','fakultas_id'=>1],
            ['kode_program_studi' =>'FMIPA01','nama_program_studi' => 'Pendidikan Matematika','fakultas_id'=>2],
            ['kode_program_studi' =>'FMIPA02','nama_program_studi' => 'Pendidikan Biologi','fakultas_id'=>2],
            ['kode_program_studi' =>'FMIPA03','nama_program_studi' => 'Pendidikan Fisika','fakultas_id'=>2],
            ['kode_program_studi' => 'FIPPS01', 'nama_program_studi' => 'Pendidikan IPS Sejarah','fakultas_id'=>4],
            ['kode_program_studi' =>'FIPPS02','nama_program_studi' => 'Bimbingan dan Konseling','fakultas_id'=>4],
            ['kode_program_studi' =>'FIPPS03','nama_program_studi' => 'Bisnis Digital','fakultas_id'=>4],
            ['kode_program_studi' =>'FIPPS04','nama_program_studi' => 'Manajemen Ritel','fakultas_id'=>4],
             ['kode_program_studi' =>'FIPPS05','nama_program_studi' => 'Pendidikan Ekonomi','fakultas_id'=>4],
        ]);
    }
}
