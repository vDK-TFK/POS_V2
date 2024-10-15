import Select from 'react-select';


const SelectWithFilter = ({ options, selectedValue, onChange }) => {

  return (
    <Select
    options={options}
    value={selectedValue}
    onChange={onChange}
      isClearable
      isSearchable
      placeholder="--Seleccione--"
      className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark: border border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
    />
  );

  
};

export default SelectWithFilter;
