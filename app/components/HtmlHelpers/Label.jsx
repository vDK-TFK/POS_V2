
const HtmlLabel = ({ color, icon: Icon, legend }) => {

    const colorsDif = ["orange", "purple","red"]

    if (colorsDif.includes(color)) {
        return (
            <span
                className={`badge bg-${color}-100 text-${color}-700 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-${color}-800 dark:text-${color}-500 border border-${color}-500`}>
                {Icon && <Icon className={`mr-1 w-4 h-4`} />}
                {legend}
            </span>
        );
    }
    else {
        return (
            <span
                className={`badge bg-${color}-100 text-${color}-700 text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-${color}-800 dark:text-${color}-500 border border-${color}-500`}>
                {Icon && <Icon className={`mr-1 w-4 h-4`} />}
                {legend}
            </span>
        );
    }



};

export default HtmlLabel;
