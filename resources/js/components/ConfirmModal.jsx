export default function ConfirmModal({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                                   hover:bg-gray-50 active:bg-gray-100
                                   focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white
                                   hover:bg-red-700 active:bg-red-800
                                   focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}