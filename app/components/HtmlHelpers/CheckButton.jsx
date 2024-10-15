
const HtmlCheckButton = ({ id, legend, colSize, additionalClass, onChange, checked }) => {
    return (
        <div className={`col-span-${colSize} flex items-center`}>
            <input 
                type="checkbox" 
                id={id} 
                name={id} 
                checked={checked} 
                onChange={onChange} 
                className={`${additionalClass} bg-gray-50 border border-gray-300 text-blue-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            />

            <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                {legend}
            </label>
        </div>
    );
};

export default HtmlCheckButton;
