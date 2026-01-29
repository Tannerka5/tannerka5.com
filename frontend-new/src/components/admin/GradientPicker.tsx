import { type FC } from 'react';

interface GradientPickerProps {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  onGradientChange: (from: string, via: string, to: string) => void;
}

// Predefined gradient options based on existing projects
const GRADIENT_PRESETS = [
  {
    name: 'Pink to Purple',
    from: 'from-pink-100 dark:from-pink-900/40',
    via: 'via-pink-200 dark:via-purple-900/40',
    to: 'to-purple-100 dark:to-purple-900/40',
  },
  {
    name: 'Blue to Sky',
    from: 'from-blue-50 dark:from-blue-900/40',
    via: 'via-blue-100 dark:via-sky-900/40',
    to: 'to-sky-100 dark:to-sky-900/40',
  },
  {
    name: 'Primary Gradient',
    from: 'from-primary dark:from-primary-dark',
    via: 'via-primary-light dark:via-primary',
    to: 'to-secondary dark:to-secondary-dark',
  },
  {
    name: 'Purple to Pink',
    from: 'from-purple-100 dark:from-purple-900/40',
    via: 'via-purple-200 dark:via-pink-900/40',
    to: 'to-pink-100 dark:to-pink-900/40',
  },
  {
    name: 'Green to Teal',
    from: 'from-green-100 dark:from-green-900/40',
    via: 'via-emerald-100 dark:via-emerald-900/40',
    to: 'to-teal-100 dark:to-teal-900/40',
  },
  {
    name: 'Orange to Red',
    from: 'from-orange-100 dark:from-orange-900/40',
    via: 'via-orange-200 dark:via-red-900/40',
    to: 'to-red-100 dark:to-red-900/40',
  },
];

const GradientPicker: FC<GradientPickerProps> = ({
  gradientFrom,
  gradientVia,
  gradientTo,
  onGradientChange,
}) => {
  const currentGradient = `${gradientFrom} ${gradientVia} ${gradientTo}`;

  return (
    <div>
      <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
        Gradient Colors
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {GRADIENT_PRESETS.map((preset) => {
          const presetGradient = `${preset.from} ${preset.via} ${preset.to}`;
          const isSelected = currentGradient === presetGradient;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onGradientChange(preset.from, preset.via, preset.to)}
              className={`relative h-20 rounded-lg bg-gradient-to-br ${presetGradient} border-2 transition-all ${
                isSelected
                  ? 'border-accent dark:border-accent-light ring-2 ring-accent/50'
                  : 'border-sage/20 dark:border-gray-600 hover:border-sage/40'
              }`}
              title={preset.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              <span className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/50 rounded px-1 truncate">
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        <div>
          <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
            From
          </label>
          <input
            type="text"
            value={gradientFrom}
            onChange={(e) => onGradientChange(e.target.value, gradientVia, gradientTo)}
            className="w-full px-3 py-1.5 text-sm border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
            placeholder="from-pink-100 dark:from-pink-900/40"
          />
        </div>
        <div>
          <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
            Via
          </label>
          <input
            type="text"
            value={gradientVia}
            onChange={(e) => onGradientChange(gradientFrom, e.target.value, gradientTo)}
            className="w-full px-3 py-1.5 text-sm border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
            placeholder="via-pink-200 dark:via-purple-900/40"
          />
        </div>
        <div>
          <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
            To
          </label>
          <input
            type="text"
            value={gradientTo}
            onChange={(e) => onGradientChange(gradientFrom, gradientVia, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
            placeholder="to-purple-100 dark:to-purple-900/40"
          />
        </div>
      </div>
      <div className="mt-3 p-3 bg-cream dark:bg-gray-900 rounded-lg">
        <div className="text-xs text-earth/70 dark:text-gray-400 mb-1">Preview:</div>
        <div className={`h-16 rounded-lg bg-gradient-to-br ${currentGradient}`} />
      </div>
    </div>
  );
};

export default GradientPicker;
