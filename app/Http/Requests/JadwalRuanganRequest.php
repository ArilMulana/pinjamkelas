<?php

namespace App\Http\Requests;

use App\Models\JadwalRuangan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

class JadwalRuanganRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()?->role_id ===1;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rooms_id' => 'required|exists:rooms,id',
            'matakuliah_id' => 'required|exists:matakuliah_program_studi,id',
            'hari' => 'required|string|max:10',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ];
    }

    public function withValidator(Validator $validator){
         $validator->after(function ($validator) {
            if ($this->hasConflict()) {
                $validator->errors()->add('jam_mulai', 'Jadwal bentrok dengan jadwal lain di ruangan tersebut.');
            }
        });
    }

    protected function hasConflict(): bool
    {
        $jadwalId = $this->route('jadwal_ruangan'); // Sesuaikan dengan nama parameter route
        return JadwalRuangan::where('rooms_id', $this->rooms_id)
            ->where('hari', $this->hari)
            ->when($jadwalId, function ($query) use ($jadwalId) {
                $query->where('id', '!=', $jadwalId); // Abaikan diri sendiri jika update
            })
            ->where(function ($query) {
                $query->whereBetween('jam_mulai', [$this->jam_mulai, $this->jam_selesai])
                      ->orWhereBetween('jam_selesai', [$this->jam_mulai, $this->jam_selesai])
                      ->orWhere(function ($query) {
                          $query->where('jam_mulai', '<', $this->jam_mulai)
                                ->where('jam_selesai', '>', $this->jam_selesai);
                      });
            })
            ->exists();
    }
}
