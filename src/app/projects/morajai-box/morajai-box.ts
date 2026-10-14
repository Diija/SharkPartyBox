import { Component, OnInit } from '@angular/core';
import { BOX_LINE_SIZE, BOX_SIZE, FIRST_ROW_INDEX, LAST_ROW_INDEX, morajaiGame, morajaiPiece, morajaiPiecesDefinition, pieceNeighborsIndex } from './data/morajai-box-game.interfaces';

@Component({
  selector: 'app-morajai-box',
  imports: [],
  templateUrl: './morajai-box.html',
  styleUrl: './morajai-box.scss',
})
export class MorajaiBox implements OnInit {
  pieces_types: { [ pieceName: string ]: morajaiPiecesDefinition } = {
    gray: { //do nothing
      name: 'Gray',
      action: () => {}
    },
    white: { //divid itself and explode the core 
      name: 'White',
      action: (pieceIndex: number) => {
        const neighbors = this.getPieceNeighbors(pieceIndex);
        const targetPositions = ['up', 'right', 'bottom', 'left'] as const satisfies readonly (keyof pieceNeighborsIndex)[];
        for(const position of targetPositions) {
          const targetIndex = neighbors[position];
          if(targetIndex === null) continue;
          if (this.morajaiBox.grid[targetIndex].name === 'Gray') {
            this.morajaiBox.grid[targetIndex] = this.pieces_types['white'];
          }
        }
        this.morajaiBox.grid[pieceIndex] = this.pieces_types['gray'];
      }
    },
    black: { //move the line to the right
      name: 'Black',
      action: (pieceIndex: number) => {
        const pieceRow = this.getPieceRow(pieceIndex);
        const rowStartIndex = pieceRow * BOX_LINE_SIZE;
        [this.morajaiBox.grid[rowStartIndex], this.morajaiBox.grid[rowStartIndex + 1], this.morajaiBox.grid[rowStartIndex + 2]] =
        [this.morajaiBox.grid[rowStartIndex + 2], this.morajaiBox.grid[rowStartIndex], this.morajaiBox.grid[rowStartIndex + 1]];
      }
    },
    red: { //turn white into black and black into red 
      name: 'Red',
      action: () => {
        this.morajaiBox.grid = this.morajaiBox.grid.map(toConvertPiece => {
          switch (toConvertPiece.name) {
            case 'Black':
              toConvertPiece = this.pieces_types['red'];
              break;
            case 'White':
              toConvertPiece = this.pieces_types['black'];
              break;
          }
          return toConvertPiece;
        });
      }
    },
    yellow: { //move up
      name: 'Yellow',
      action: (pieceIndex: number) => {
        if(this.getPieceRow(pieceIndex) === FIRST_ROW_INDEX) return;
        this.swapPiecesPlaces(pieceIndex, pieceIndex - 3);
      }
    },
    purple: { //move down
      name: 'Purple',
      action: (pieceIndex: number) => {
        if(this.getPieceRow(pieceIndex) === LAST_ROW_INDEX) return;
        this.swapPiecesPlaces(pieceIndex, pieceIndex + 3);
      }
    },
    green: { //jump across the board
      name: 'Green',
      action: (pieceIndex: number) => {
        const pieceNewSlotIndex = BOX_SIZE - (pieceIndex + 1);
        this.swapPiecesPlaces(pieceIndex, pieceNewSlotIndex);
      }
    },
    pink: { 
      name: 'Pink',
      action: (pieceIndex: number) => {
        const neighbors = this.getPieceNeighbors(pieceIndex);
        const neighborsCircle = [neighbors.left, neighbors.upleft, neighbors.up, neighbors.upright, neighbors.right, neighbors.bottomright, neighbors.bottom, neighbors.bottomleft].filter(neighbor => neighbor !== null);

        const saveFirstPiece = {...this.morajaiBox.grid[<number>neighborsCircle.at(-1)]};
        for(let i = neighborsCircle.length - 1; i > 0; i--) {
          const circlePieceIndex = neighborsCircle[i];
          this.morajaiBox.grid[circlePieceIndex] = this.morajaiBox.grid[<number>neighborsCircle.at(i - 1)];
        }
        this.morajaiBox.grid[neighborsCircle[0]] = saveFirstPiece;
      }
    }, //rotate
    orange: { name: 'Orange' }, //is dominated
  }

  morajaiBox: morajaiGame = {
    grid: [],
    corners: [],
  }
  
  ngOnInit(): void {
    this.generateRandomBox();
  }

  generateRandomBox() {
    var keys = Object.keys(this.pieces_types);
    for(let i = 0; i < BOX_SIZE; i++) {
      let pickedPiece = this.pieces_types[keys[ keys.length * Math.random() << 0]];
      this.morajaiBox.grid.push({...pickedPiece});
    }
  }

  onPieceClick(pieceIndex: number) {
    const piece = this.morajaiBox.grid[pieceIndex];
    piece.action ? piece.action(pieceIndex) : null;
  }

  getPieceAt(row: number, col: number) {
    if(row < 0 || row > BOX_LINE_SIZE - 1 || col < 0 || col > BOX_LINE_SIZE -1) return null;

    const gridAbsolutePositon = (row  * BOX_LINE_SIZE) + col;
    return this.morajaiBox.grid[gridAbsolutePositon];
  }

  getPieceIndex(row: number, col: number) {
    const pieceIndex = row * BOX_LINE_SIZE + col;
    if(row < 0 || row >= BOX_LINE_SIZE || col < 0 || col >= BOX_LINE_SIZE || pieceIndex < 0 || pieceIndex >= BOX_SIZE) return null;
    return pieceIndex;
  }

  getPieceRow(pieceIndex: number) {
    return Math.floor(pieceIndex / BOX_LINE_SIZE);
  }

  getPieceCol(pieceIndex: number) {
    return pieceIndex % BOX_LINE_SIZE;
  }

  getPieceNeighbors(pieceIndex: number): pieceNeighborsIndex {
    const pieceRow = this.getPieceRow(pieceIndex);
    const pieceCol = this.getPieceCol(pieceIndex);

    return {
      upleft: this.getPieceIndex(pieceRow - 1, pieceCol - 1),
      up: this.getPieceIndex(pieceRow - 1, pieceCol),
      upright: this.getPieceIndex(pieceRow - 1, pieceCol + 1),
      left: this.getPieceIndex(pieceRow, pieceCol - 1),
      right: this.getPieceIndex(pieceRow, pieceCol + 1),
      bottomleft: this.getPieceIndex(pieceRow + 1, pieceCol - 1),
      bottom: this.getPieceIndex(pieceRow + 1, pieceCol),
      bottomright: this.getPieceIndex(pieceRow + 1, pieceCol + 1),
    }
  }

  swapPiecesPlaces(pieceAIndex: number, pieceBIndex: number) {
    [this.morajaiBox.grid[pieceAIndex], this.morajaiBox.grid[pieceBIndex]] = [this.morajaiBox.grid[pieceBIndex], this.morajaiBox.grid[pieceAIndex]];
  }
}
