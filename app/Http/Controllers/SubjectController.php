<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Student;

class SubjectController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if($user->hasRole('admin')){
            return Subject::all();
        }

        return Subject::when($user->hasRole('teacher'), fn ($q) => $q->where('teacher_id',$user->id))
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
                'code' => 'required|string|max:10|unique:subjects,code',
                'name' => 'required|string|max:255',
                'course' => 'required|string|max:255',
        ]);

        $validated['teacher_id'] = auth()->id();

        $subject = Subject::create($validated);

        return response()->json($subject, 201);
    }
       
    public function update(Request $request, Subject $subject)
    {
        $this->authorizeOwnership($subject);

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
        $this->authorizeOwnership($subject);

        $subject->delete();
        return response()->json(null, 204);
    }

    public function enroll(Request $request, Student $student)
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

    private function authorizeOwnership(Subject $subject)
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return;
        }

        if ($subject->teacher_id !== $user->id) {
            abort(403, 'You do not manage this subject.');
        }
    }
}