
import React, { ChangeEvent } from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string | number | null; // Umožňuje null pro číselné hodnoty
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  isTextarea?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
  checked?: boolean; // For checkboxes
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  options,
  isTextarea = false,
  disabled = false,
  min,
  max,
  className = '',
  checked,
}) => {
  const commonProps = {
    id,
    name,
    value: value ?? '', // Handle null/undefined for controlled components
    onChange,
    required,
    placeholder,
    disabled,
    className: `mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 placeholder-gray-400 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`, // Přidána text-gray-900 a placeholder-gray-400
  };

  if (type === 'checkbox') {
    return (
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
        />
        <label htmlFor={id} className="ml-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea {...commonProps} rows={3}></textarea>
      ) : options ? (
        <select {...commonProps}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value.toString()} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input {...commonProps} type={type} min={min} max={max} />
      )}
    </div>
  );
};

export default FormField;
