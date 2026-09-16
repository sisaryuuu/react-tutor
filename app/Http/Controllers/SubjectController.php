<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Student;

 class SubjectController extends Controller
{
    public function index()
    {
        return SUbject::withCount('students')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
                'code' => 'required|string|max:10|unique:subjects,code',
                'name' => 'required|string|max:255',
                'course' => 'required|string|max:255',
        ]);
         $subject = Subject::create($validated);

        return response()->json($subject, 201);
    
    }
       
    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:subjects,code,' . $subject->id,
            'name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
        ]);

        $subject->update($validated);

        return response()->json($subject);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(null, 204);
    }

    public function enroll(Request $request, Student $student,)
    {
        $validated = $request->validate([
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $student->subjects()->syncWithoutDetaching($validated['subject_ids']);

        return response()->json($student->load('subjects'));
    }

    public function unenroll(Student $student, Subject $subject)
    {
        $student->subjects()->detach($subject->id);

        return response()->json(null, 204);
    }


}

?>