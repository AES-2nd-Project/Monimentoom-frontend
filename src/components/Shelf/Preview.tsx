import clsx from 'clsx';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Bounds, Coordinate } from '../../types/room';
import { getItemGridCoord } from './shelfUtils';

interface PreviewProps {
  preview: Bounds | null;
  isPreviewOverlapping: boolean;
  dragStart: Coordinate | null;
  selection: Bounds | null;
  clearSelection: () => void;
}

const Preview = ({
  preview,
  isPreviewOverlapping,
  dragStart,
  selection,
  clearSelection,
}: PreviewProps) => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  return (
    <>
      {isEditMode && preview && (
        <div
          style={getItemGridCoord(preview)}
          className={clsx(
            'pointer-events-none relative z-30 mx-2 flex items-center justify-center rounded-lg border-2 shadow-md transition-all',
            isPreviewOverlapping
              ? 'border-red-500 bg-red-400 text-red-900'
              : 'border-blue-500 bg-blue-300 text-blue-900',
            !dragStart && selection && !isPreviewOverlapping && 'animate-pulse'
          )}
        >
          {preview.c2 - preview.c1 + 1} x {preview.r2 - preview.r1 + 1}
          {/* 선택 대기 상태일 때만 우상단에 X 버튼 표시 */}
          {!dragStart && selection && (
            <button
              onClick={e => {
                e.stopPropagation();
                clearSelection();
              }}
              className={`pointer-events-auto absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600`}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Preview;
