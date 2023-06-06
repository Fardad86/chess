
import { BoardPosition } from "./BoardPosition.js";
import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";
import { WebChessGame } from "./webchessgame.js";

import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";
import { EmptyPiece } from "./pieces/emptypiece.js";

export class ChessGame {

    public boardOfPieces: Piece[][] = new Array<Array<Piece>>(8);
    public moveTracker = new MoveTracker();
    public active: boolean = false;
    public webgame: WebChessGame;
    public turncount: number = 0;

    constructor(webgame: WebChessGame) {

        this.webgame = webgame;
        this.initializeBoardOfPieces();
    }

    initializeBoardOfPieces() {

        for (let i = 0; i < 8; i++) {
            this.boardOfPieces[i] = new Array<Piece>(8);
            for (let j = 0; j < 8; j++){
                this.boardOfPieces[i][j] = new EmptyPiece(this.webgame, this);
            }
        }
        // this.placeBlackPieces();
        // this.placeWhitePieces();
        this.boardOfPieces[0][3] = new Rook(this.webgame, this, "b")
        this.boardOfPieces[7][3] = new Queen(this.webgame, this, "w")
    }

    placeBlackPieces() {

        for (let j = 0; j < 8; j++) {
            this.boardOfPieces[1][j] = new Pawn(this.webgame, this, "b")
        }

        this.boardOfPieces[0][0] = new Rook(this.webgame, this, "b")
        this.boardOfPieces[0][1] = new Knight(this.webgame, this, "b")
        this.boardOfPieces[0][2] = new Bishop(this.webgame, this, "b")
        this.boardOfPieces[0][3] = new Queen(this.webgame, this, "b")

        this.boardOfPieces[0][4] = new King(this.webgame, this, "b")
        this.boardOfPieces[0][5] = new Bishop(this.webgame, this, "b")
        this.boardOfPieces[0][6] = new Knight(this.webgame, this, "b")
        this.boardOfPieces[0][7] = new Rook(this.webgame, this, "b")
    }

    placeWhitePieces() {

        for (let j = 0; j < 8; j++) {
            this.boardOfPieces[6][j] = new Pawn(this.webgame, this, "w")
        }

        this.boardOfPieces[7][0] = new Rook(this.webgame, this, "w")
        this.boardOfPieces[7][1] = new Knight(this.webgame, this, "w")
        this.boardOfPieces[7][2] = new Bishop(this.webgame, this, "w")
        this.boardOfPieces[7][3] = new Queen(this.webgame, this, "w")

        this.boardOfPieces[7][4] = new King(this.webgame, this, "w")
        this.boardOfPieces[7][5] = new Bishop(this.webgame, this, "w")
        this.boardOfPieces[7][6] = new Knight(this.webgame, this, "w")
        this.boardOfPieces[7][7] = new Rook(this.webgame, this, "w")
    }

    interpretSelection(move: BoardPosition) {

        if (!this.active) {
            this.processStartMove(move);
        } else if (this.active) {
            this.processEndCell(move)
            if (this.active) {
                this.webgame.clearHighlights();
                this.active = false;
                this.processStartMove(move);
            }
        }
    }

    getTurnPlayer(): string {

        return (this.turncount % 2 == 0) ? "w" : "b";
    }

    validStart(i: number, j: number): boolean {

        const piece = this.boardOfPieces[i][j];
        return piece.colour == this.getTurnPlayer();
    }

    validEnd(i: number, j: number): boolean {

        const tile = this.webgame.grid[i][j]
        return (tile.classList.contains("validmove"));
    }

    processStartMove(move: BoardPosition) {

        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }

    activateStart(i: number, j: number) {

        const tile = this.webgame.grid[i][j]
        this.moveTracker.setStartMove(i, j);
        tile.classList.add("highlighted")
        this.active = true;
        this.populateOptions(i, j);
    }

    processEndCell(move: BoardPosition) {

        if (this.validEnd(move.i, move.j)) {
            this.moveTracker.setEndMove(move.i, move.j);
            this.active = false;
            this.submitMove();
            this.turncount += 1;
        }
    }

    submitMove() {

        const start: BoardPosition | undefined = this.moveTracker.getStartMove();
        const end: BoardPosition | undefined = this.moveTracker.getEndMove();

        if (!start || !end) {
            return;
        }

        const piece: Piece = this.boardOfPieces[start.i][start.j]

        this.boardOfPieces[end.i][end.j] = piece
        this.boardOfPieces[start.i][start.j] = new EmptyPiece(this.webgame, this);
        this.webgame.paintPieces(this.boardOfPieces)
        this.webgame.clearHighlights()
    }

    legalPosition(i: number, j: number, colour: string): boolean {

        if (this.validCoordinates(i, j)) {
            const piece: Piece = this.boardOfPieces[i][j];
            if (piece instanceof EmptyPiece){
                this.webgame.addDot(i, j);
                return true;
            }
            if (piece.colour != colour) {
                this.webgame.addCircle(i, j)
                return true
            }
        }

        return false;
    }

    validCoordinates(i: number, j: number) {

        return (0 <= i && i < 8 && 0 <= j && j < 8);
    }

    populateOptions(i: number, j: number) {

        const piece: Piece = this.boardOfPieces[i][j];
        piece.moveOptions(i, j);
    }
}
