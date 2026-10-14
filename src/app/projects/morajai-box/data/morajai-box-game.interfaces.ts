export const BOX_LINE_SIZE = 3;
export const BOX_SIZE = BOX_LINE_SIZE * BOX_LINE_SIZE;
export const FIRST_ROW_INDEX = 0;
export const LAST_ROW_INDEX = BOX_LINE_SIZE - 1;

export interface morajaiPiecesDefinition {
    name: string;
    action?: (pieceIndex: number) => void
}

export interface morajaiPiece extends morajaiPiecesDefinition {
    // piecePositionIndex: number;
}

export interface morajaiGame {
    grid: morajaiPiece[],
    corners: morajaiPiece['name'][],
}

export type possiblePieceNeighbors = keyof pieceNeighborsIndex;
export interface pieceNeighborsIndex {
    upleft: number | null;
    up: number | null;
    upright: number | null;
    left: number | null;
    right: number | null;
    bottomleft: number | null;
    bottom: number | null;
    bottomright: number | null;
}