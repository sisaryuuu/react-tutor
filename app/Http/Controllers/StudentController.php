<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Subject;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        


        return Student::with('subjects')->get();


    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'course' => 'required|string|max:255',


        ]);

        $student = Student::create($validated);

        return response()->json($student->load('subjects'), 201);
    }

    /**
     * Display the specified resource.
     */
   public function show(Student $student)
{
    return $student->load('subjects');
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)

    {
            $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'course' => 'required|string|max:255',


        ]);

        $student->update($validated);

        return response()->json($student->load('subjects'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(null, 204);
    }
}
