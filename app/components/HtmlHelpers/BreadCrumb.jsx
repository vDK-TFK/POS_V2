
const HtmlBreadCrumb = ({ items }) => {
    return (
        <div className="p-1">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    {items.map((item, index) => (
                        index === 0 ? (
                            <li key={index} className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    {item}
                                </a>
                            </li>
                        ) : (
                            <li key={index} aria-current="page">
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <span className="ms-1 text-md font-medium text-gray-500 md:ms-2 dark:text-gray-400">{item}</span>
                                </div>
                            </li>
                        )
                    ))}
                </ul>
        </div>

        
    );
};

export default HtmlBreadCrumb;
