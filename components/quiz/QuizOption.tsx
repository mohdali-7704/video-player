'use client';

interface QuizOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  showResult: boolean;
  onSelect: (index: number) => void;
  disabled: boolean;
}

export default function QuizOption({
  option,
  index,
  isSelected,
  isCorrect,
  showResult,
  onSelect,
  disabled
}: QuizOptionProps) {
  const getOptionClasses = () => {
    let classes = 'w-full text-left p-4 rounded-lg border-2 transition-all ';

    if (showResult) {
      if (isCorrect) {
        classes += 'border-green-600 bg-green-100 text-green-900 font-medium';
      } else if (isSelected && !isCorrect) {
        classes += 'border-red-600 bg-red-100 text-red-900 font-medium';
      } else {
        classes += 'border-gray-400 bg-gray-100 text-gray-800';
      }
    } else {
      if (isSelected) {
        classes += 'border-blue-600 bg-blue-100 text-blue-900 font-medium';
      } else {
        classes += 'border-gray-400 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50';
      }
    }

    if (disabled && !showResult) {
      classes += ' cursor-not-allowed opacity-50';
    } else if (!showResult) {
      classes += ' cursor-pointer';
    }

    return classes;
  };

  const getOptionLabel = (idx: number) => {
    return String.fromCharCode(65 + idx); // A, B, C, D
  };

  return (
    <button
      type="button"
      className={getOptionClasses()}
      onClick={() => !disabled && !showResult && onSelect(index)}
      disabled={disabled && !showResult}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold">
          {getOptionLabel(index)}
        </div>
        <div className="flex-1 text-left">{option}</div>
        {showResult && isCorrect && (
          <div className="flex-shrink-0 text-green-600">✓</div>
        )}
        {showResult && isSelected && !isCorrect && (
          <div className="flex-shrink-0 text-red-600">✗</div>
        )}
      </div>
    </button>
  );
}
