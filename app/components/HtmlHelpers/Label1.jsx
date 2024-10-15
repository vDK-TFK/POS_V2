import classNames from 'classnames';

const colorClasses = {
    blue: {
        base: 'bg-blue-200 text-blue-700 border-blue-800',
        dark: 'dark:bg-blue-700 dark:text-blue-200 border-blue-900',
    },
    red: {
        base: 'bg-red-200 text-red-700 border-red-800',
        dark: 'dark:bg-red-700 dark:text-red-200 border-red-900',
    },
    green: {
        base: 'bg-green-200 text-green-700 border-green-800',
        dark: 'dark:bg-green-700 dark:text-green-200 border-green-900',
    },
    yellow: {
        base: 'bg-yellow-200 text-yellow-500 border-yellow-800',
        dark: 'dark:bg-yellow-500 dark:text-yellow-200 border-yellow-900',
    },
    cyan: {
        base: 'bg-cyan-200 text-cyan-700 border-cyan-800',
        dark: 'dark:bg-cyan-500 dark:text-cyan-200 border-cyan-900',
    },
    gray: {
        base: 'bg-stone-200 text-stone-700 border-stone-800',
        dark: 'dark:bg-stone-500 dark:text-stone-200 border-stone-900',
    },
    orange: {
        base: 'bg-orange-300 text-orange-700 border-orange-800',
        dark: 'dark:bg-orange-500 dark:text-orange-200 border-orange-900',
    },
    teal: {
        base: 'bg-teal-200 text-teal-700 border-teal-800',
        dark: 'dark:bg-teal-500 dark:text-teal-200 border-teal-900',
    },
    lime: {
        base: 'bg-lime-200 text-lime-700 border-lime-800',
        dark: 'dark:bg-lime-500 dark:text-lime-200 border-lime-900',
    },
    pink: {
        base: 'bg-pink-300 text-pink-700 border-pink-800',
        dark: 'dark:bg-pink-500 dark:text-pink-200 border-pink-900',
    },
    indigo: {
        base: 'bg-indigo-300 text-indigo-700 border-indigo-800',
        dark: 'dark:bg-indigo-500 dark:text-indigo-200 border-indigo-900',
    },
    amber: {
        base: 'bg-amber-200 text-amber-700 border-amber-800',
        dark: 'dark:bg-amber-500 dark:text-amber-200 border-amber-900',
    },
    rose: {
        base: 'bg-rose-300 text-rose-800 border-rose-800',
        dark: 'dark:bg-rose-500 dark:text-rose-200 border-rose-900',
    },
    fuchsia: {
        base: 'bg-fuchsia-300 text-fuchsia-700 border-fuchsia-800',
        dark: 'dark:bg-fuchsia-500 dark:text-fuchsia-200 border-fuchsia-900',
    },
    violet: {
        base: 'bg-violet-200 text-violet-700 border-violet-800',
        dark: 'dark:bg-violet-500 dark:text-violet-200 border-violet-900',
    },
    emerald: {
        base: 'bg-emerald-200 text-emerald-700 border-emerald-800',
        dark: 'dark:bg-emerald-500 dark:text-emerald-200 border-emerald-900',
    },
    slate: {
        base: 'bg-slate-300 text-slate-700 border-slate-800',
        dark: 'dark:bg-slate-500 dark:text-slate-200 border-slate-900',
    },
    zinc: {
        base: 'bg-zinc-200 text-zinc-700 border-zinc-800',
        dark: 'dark:bg-zinc-500 dark:text-zinc-200 border-zinc-900',
    },
};

const HtmlNewLabel = ({ color, icon: Icon, legend }) => {
    const colorClass = colorClasses[color] || colorClasses.blue; // Valor por defecto: azul

    return (
        <span
            className={classNames(
                "badge text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 border",
                colorClass.base,
                colorClass.hover,
                colorClass.dark
            )}
        >
            {Icon && <Icon className="mr-1 w-4 h-4" />}
            {legend}
        </span>
    );
};

export default HtmlNewLabel;
