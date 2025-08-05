<?php
namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class DataCheckerService
{
    public function cekData(Model $model, string $column, string $value): bool
    {
        return $model->where($column, $value)->exists();
    }
}
