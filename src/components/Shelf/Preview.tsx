import clsx from 'clsx';
import { useState } from 'react';
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
  onDropImage: (goodsId: number, imageUrl: string) => void;
}

const Preview = ({
  preview,
  isPreviewOverlapping,
  dragStart,
  selection,
  clearSelection,
  onDropImage,
}: PreviewProps) => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const [isDragOver, setIsDragOver] = useState(false);

  const isConfirmed = !dragStart && selection && !isPreviewOverlapping;

  return (
    <>
      {isEditMode && preview && (
        <div
          style={getItemGridCoord(preview)}
          className={clsx(
            `relative z-30 mx-2 flex items-center justify-center rounded-lg border-2 shadow-md transition-all`,
            isPreviewOverlapping
              ? `border-point-pink bg-point-pink/60 text-point-pink pointer-events-none`
              : `border-point-green bg-point-green/60 text-point-green`,
            isConfirmed && !isDragOver && `animate-pulse`
          )}
          onDragOver={
            isConfirmed
              ? e => {
                  e.preventDefault();
                  setIsDragOver(true);
                }
              : undefined
          }
          onDragLeave={isConfirmed ? () => setIsDragOver(false) : undefined}
          onDrop={
            isConfirmed
              ? e => {
                  e.preventDefault();
                  const raw = e.dataTransfer.getData('inventory-goods');
                  if (raw) {
                    try {
                      const { goodsId, imageUrl } = JSON.parse(raw);
                      if (typeof goodsId === 'number' && typeof imageUrl === 'string') {
                        onDropImage(goodsId, imageUrl);
                      }
                    } catch {
                      // 앱 외부에서 드롭된 잘못된 데이터 무시
                    }
                  }
                  setIsDragOver(false);
                }
              : undefined
          }
        >
          {!isConfirmed && (
            <span className={`pointer-events-none text-sm`}>
              {preview.c2 - preview.c1 + 1} x {preview.r2 - preview.r1 + 1}
            </span>
          )}

          {isConfirmed && (
            <button
              onClick={e => {
                e.stopPropagation();
                clearSelection();
              }}
              className={`bg-point-pink text-purple-white pointer-events-auto absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs shadow hover:opacity-80`}
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
