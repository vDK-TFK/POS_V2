const HtmlFormInput = ({ id, name, legend, type, colSize, additionalClass, onChange, value, onKeyUp, maxLength = '500', disabled = false }) => {
    const autoCompleteValue = type == 'password' ? 'new-password' : type == 'email' ? 'off' : type == 'text' ? 'on' : 'on';

    return (
        <div className={`col-span-${colSize} m-2`}>
            <label htmlFor={id} className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-200">{legend && `${legend}:`}</label>
            <input
                disabled={disabled}
                maxLength={maxLength}
                name={name}
                value={value}
                type={type}
                id={id}
                onChange={onChange}
                onKeyUp={onKeyUp}
                autoComplete={autoCompleteValue} // Atributo autoComplete
                className={`${additionalClass} bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark: border border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            />
        </div>
    );
};

export default HtmlFormInput;
