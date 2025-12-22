// Example: How to use Toast Notifications in your components

import React from 'react';
import { useToast } from '../contexts/ToastContext';

const ExampleComponent = () => {
    const toast = useToast();

    const handleSuccess = () => {
        toast.success('SOR created successfully!');
    };

    const handleError = () => {
        toast.error('Failed to save data. Please try again.');
    };

    const handleWarning = () => {
        toast.warning('This action cannot be undone!');
    };

    const handleInfo = () => {
        toast.info('Your session will expire in 5 minutes.');
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Toast Notification Examples</h2>

            <div className="space-y-3">
                <button
                    onClick={handleSuccess}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                    Show Success Toast
                </button>

                <button
                    onClick={handleError}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Show Error Toast
                </button>

                <button
                    onClick={handleWarning}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                    Show Warning Toast
                </button>

                <button
                    onClick={handleInfo}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Show Info Toast
                </button>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-bold mb-2">Usage in your code:</h3>
                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto">
                    {`import { useToast } from '../contexts/ToastContext';

const MyComponent = () => {
    const toast = useToast();

    const handleSubmit = async () => {
        try {
            await submitForm();
            toast.success('Form submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit form');
        }
    };

    return <button onClick={handleSubmit}>Submit</button>;
};`}
                </pre>
            </div>
        </div>
    );
};

export default ExampleComponent;
