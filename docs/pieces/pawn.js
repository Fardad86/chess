import { Piece } from "../piece.js";
import { EmptyPiece } from './emptypiece.js';
export class Pawn extends Piece {
    constructor(game, colour, i, j) {
        super(game, colour, "pawn", i, j);
        this.enPassantTurn = -1;
    }
    moveOptions(i, j) {
        switch (this.colour) {
            case "b":
                this.blackPawnOptions(i, j);
                return;
            default:
                this.whitePawnOptions(i, j);
                return;
        }
    }
    pawnMove(i, j) {
        if (this.game.validCoordinates(i, j)) {
            const destination = this.boardState[i][j];
            if (destination instanceof EmptyPiece) {
                this.canMove(i, j);
                return true;
            }
        }
        return false;
    }
    pawnCapture(i, j) {
        if (this.game.validCoordinates(i, j)) {
            const targetPiece = this.boardState[i][j];
            if (targetPiece instanceof EmptyPiece || targetPiece.colour == this.colour) {
                return;
            }
            this.canMove(i, j);
        }
    }
    checkEnPassant(i, j) {
        if (!this.game.validCoordinates) {
            return;
        }
        const targetPiece = this.boardState[i][j];
        if (targetPiece instanceof Pawn) {
            if (targetPiece.enPassantTurn == this.game.turncount) {
                if (this.colour == "b" && this.game.legalPosition(i + 1, j, this.colour)) {
                    this.canMove(i + 1, j);
                }
                if (this.colour == "w" && this.game.legalPosition(i - 1, j, this.colour)) {
                    this.canMove(i - 1, j);
                }
            }
        }
    }
    blackPawnOptions(i, j) {
        if (this.pawnMove(i + 1, j) === true) {
            // starting bonus
            if (i === 1) {
                this.pawnMove(i + 2, j);
            }
        }
        // capture diagonals
        this.pawnCapture(i + 1, j - 1);
        this.pawnCapture(i + 1, j + 1);
        // en passant
        this.checkEnPassant(i, j + 1);
        this.checkEnPassant(i, j - 1);
    }
    whitePawnOptions(i, j) {
        if (this.pawnMove(i - 1, j) === true) {
            // starting bonus
            if (i === 6) {
                this.pawnMove(i - 2, j);
            }
        }
        // capture diagonals
        this.pawnCapture(i - 1, j - 1);
        this.pawnCapture(i - 1, j + 1);
        // en passant
        this.checkEnPassant(i, j + 1);
        this.checkEnPassant(i, j - 1);
    }
}
