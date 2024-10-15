const colorClasses = {
    blue: {
        base: 'bg-blue-700 text-white',
        hover: 'hover:bg-blue-500 dark:hover:bg-blue-800',
        dark: 'dark:bg-blue-700',
    },
    red: {
        base: 'bg-red-500 text-white',
        hover: 'hover:bg-red-400 dark:hover:bg-red-800',
        dark: 'dark:bg-red-700',
    },
    green: {
        base: 'bg-green-500 text-white',
        hover: 'hover:bg-green-300 dark:hover:bg-green-800',
        dark: 'dark:bg-green-700',
    },
    yellow: {
        base: 'bg-yellow-500 text-white',
        hover: 'hover:bg-yellow-300 dark:hover:bg-yellow-800',
        dark: 'dark:bg-yellow-500',
    },
    purple: {
        base: 'bg-purple-500',
        hover: 'hover:bg-purple-800 dark:hover:bg-purple-800',
        dark: 'dark:bg-purple-500',
    },
    cyan: {
        base: 'bg-cyan-500',
        hover: 'hover:bg-cyan-800 dark:hover:bg-cyan-800',
        dark: 'dark:bg-cyan-500',
    },
    gray: {
        base: 'bg-stone-800',
        hover: 'hover:bg-stone-500 dark:hover:bg-stone-700',
        dark: 'dark:bg-stone-500',
    },
    orange: {
        base: 'bg-orange-500',
        hover: 'hover:bg-orange-700 dark:hover:bg-orange-600',
        dark: 'dark:bg-orange-500',
    },
    teal: {
        base: 'bg-teal-500',
        hover: 'hover:bg-teal-700 dark:hover:bg-teal-600',
        dark: 'dark:bg-teal-500',
    },
    lime: {
        base: 'bg-lime-500',
        hover: 'hover:bg-lime-300 dark:hover:bg-lime-600',
        dark: 'dark:bg-lime-500',
    },
    pink: {
        base: 'bg-pink-500',
        hover: 'hover:bg-pink-700 dark:hover:bg-pink-600',
        dark: 'dark:bg-pink-500',
    },
    indigo: {
        base: 'bg-indigo-500',
        hover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
        dark: 'dark:bg-indigo-500',
    },
    amber: {
        base: 'bg-amber-500',
        hover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
        dark: 'dark:bg-amber-500',
    },
    rose: {
        base: 'bg-rose-500',
        hover: 'hover:bg-rose-700 dark:hover:bg-rose-600',
        dark: 'dark:bg-rose-500',
    },
    fuchsia: {
        base: 'bg-fuchsia-500',
        hover: 'hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600',
        dark: 'dark:bg-fuchsia-500',
    },
    violet: {
        base: 'bg-violet-500',
        hover: 'hover:bg-violet-700 dark:hover:bg-violet-600',
        dark: 'dark:bg-violet-500',
    },
    emerald: {
        base: 'bg-emerald-500',
        hover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
        dark: 'dark:bg-emerald-500',
    },
    slate: {
        base: 'bg-slate-500',
        hover: 'hover:bg-slate-700 dark:hover:bg-slate-600',
        dark: 'dark:bg-slate-500',
    },
    zinc: {
        base: 'bg-zinc-500',
        hover: 'hover:bg-zinc-700 dark:hover:bg-zinc-600',
        dark: 'dark:bg-zinc-500',
    },
};

const HtmlButton = ({ color, icon: Icon, legend, onClick, type = 'button', colSize=1 }) => {
    const baseClasses = 'flex items-center gap-2 shadow-lg active:scale-95 transition-transform ease-in-out duration-75 hover:scale-110 transform text-white font-semibold px-4 py-2 rounded-lg';
    const colorClass = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`col-span-${colSize} m-2`}>

        <button
            className={`${baseClasses} ${colorClass.base} ${colorClass.hover} ${colorClass.dark}`}
            type={type}
            onClick={onClick}>
            {Icon && <Icon className="text-white-500" />}
            {legend}
        </button>
        </div>
    );
};

export default HtmlButton;
