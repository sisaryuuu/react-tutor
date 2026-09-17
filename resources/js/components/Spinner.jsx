export default function Spinner({ label = 'Loading…' }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
            <div
                className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-blue-600"
                role="status"
                aria-label={label}
            />
            {label && (
                <span className="text-sm text-gray-600">{label}</span>
            )}
        </div>
    );
}