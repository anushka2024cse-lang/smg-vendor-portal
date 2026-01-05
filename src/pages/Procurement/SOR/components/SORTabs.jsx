import React from 'react';
import SORForm from './SORForm';

const SORTabs = ({ id, record, isEditMode }) => {
    return (
        <div className="min-h-[500px]">
            <SORForm
                id={id}
                isEditMode={isEditMode}
                formData={record.formData}
                setFormData={record.setFormData}
                specifications={record.specifications}
                setSpecifications={record.setSpecifications}
            />
        </div>
    );
};

export default SORTabs;
