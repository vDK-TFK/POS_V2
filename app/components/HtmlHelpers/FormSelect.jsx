import { useEffect, useState } from 'react';

const HtmlFormSelect = ({ id, legend, colSize, options, additionalClass, selectedValue, onChange,name }) => {
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        if (selectedValue !== undefined) {
            setSelectedOption(selectedValue);
        }
    }, [selectedValue]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className={`col-span-${colSize} m-2`}>
            <label htmlFor={id} className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-200">
                {legend}
            </label>
            <select
                id={id}
                name={name}
                value={selectedOption}
                onChange={handleSelectChange}
                className={`${additionalClass} bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark: border border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}>
                <option value="">---Seleccionar---</option>
                {options && options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default HtmlFormSelect;
