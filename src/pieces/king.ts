

import { ChessGame } from '../chessgame.js';
import { Piece } from "../piece.js";

export class King extends Piece {

    constructor(game: ChessGame, colour: string, i:number, j:number) {
        super(game, colour, "king", i, j);
    }

    override moveOptions(i: number, j: number): void {

        this.kingOptions(i, j);
    }

    kingOptions(i: number, j: number) {

        this.canMove(i - 1, j)
        this.canMove(i - 1, j + 1)
        this.canMove(i, j + 1)
        this.canMove(i + 1, j + 1)
        this.canMove(i + 1, j)
        this.canMove(i + 1, j - 1)
        this.canMove(i, j - 1)
        this.canMove(i - 1, j - 1)
    }
}