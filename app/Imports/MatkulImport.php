<?php

namespace App\Imports;

use App\Models\MataKuliah;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithValidation;

class MatkulImport implements ToModel, WithValidation,WithHeadingRow,WithMapping
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
   public function map($row): array
    {
        // Normalisasi heading dengan spasi menjadi snake_case
        return [
            'kode_matakuliah'   => $row['kode matakuliah'] ?? $row['kode_matakuliah'],
            'nama_matakuliah'   => $row['nama matakuliah'] ?? $row['nama_matakuliah'],
            'sks'               => $row['sks'],
            'tipe'              => $row['tipe'],
        ];
    }

      public function model(array $row)
    {

        //dd($row);
        return new MataKuliah([
            'kode_matakuliah' => $row['kode_matakuliah'],
            'nama_matakuliah' => $row['nama_matakuliah'],
            'sks' => $row['sks'],
            'tipe' => strtolower($row['tipe']),
        ]);
    }
    public function rules(): array
    {
         return [
            '*.kode_matakuliah'   => 'required|string',
            '*.nama_matakuliah'   => 'required|string',
            '*.sks'               => 'required|integer|min:1|max:6',
            '*.tipe'              => 'required|in:wajib,umum',
        ];
    }
}
