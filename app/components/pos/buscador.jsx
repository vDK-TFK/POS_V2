import { Search } from "lucide-react";

export default function Buscador() {
    return (
<div className="relative flex items-center">
    <label htmlFor="search-product" className="sr-only">Buscar producto</label>
    <input
        id="search-product"
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Buscar..."
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
</div>

    );
}
