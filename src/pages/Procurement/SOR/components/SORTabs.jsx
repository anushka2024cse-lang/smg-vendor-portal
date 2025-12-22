import React from 'react';
import SORForm from './SORForm';

const SORTabs = ({ id, record, isEditMode }) => {
    return (
        <div className="min-h-[500px]">
            <SORForm id={id} existingData={record} isEditMode={isEditMode} />
        </div>
    );
};

export default SORTabs;
