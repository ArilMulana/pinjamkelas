<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreBuildingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()?->role_id === 1;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $gedungId = $this->route('building');
        return [
            'name'=>'required|string|max:255',
            'code'=>'required|string|max:100|unique:buildings,code',
            'lokasi'=>'required|string'
        ];
    }

    //  public function messages(): array
    // {
    //     return [
    //         'name.required' => 'Nama gedung wajib diisi.',
    //         'code.unique'   => 'Kode gedung sudah digunakan.',
    //     ];
    // }
}
