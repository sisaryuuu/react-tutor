<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['code', 'name', 'course','teacher_id'];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_subject')
                    ->withTimestamps();
    }
}