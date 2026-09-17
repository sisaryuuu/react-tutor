import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    function dismiss(id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    // Map toast types to Tailwind color classes
    const typeStyles = {
        success: 'bg-green-600 text-white',
        error:   'bg-red-600 text-white',
        warning: 'bg-yellow-500 text-black',
        info:    'bg-blue-600 text-white',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast stack: fixed bottom-right, stacked vertically */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => dismiss(t.id)}
                        className={`
                            min-w-[220px] max-w-sm
                            px-4 py-3
                            rounded-lg shadow-lg
                            text-sm font-medium
                            cursor-pointer
                            animate-[toast-in_0.25s_ease-out]
                            hover:opacity-90 transition-opacity
                            ${typeStyles[t.type] ?? typeStyles.info}
                        `}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}