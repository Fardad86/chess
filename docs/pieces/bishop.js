import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';
export class Bishop extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "bishop");
    }
    moveOptions(i, j) {
        this.bishopOptions(i, j);
    }
    bishopOptions(i, j) {
        const position = new BoardPosition(i, j);
        this.checkAlongImpulse(position, -1, 1);
        this.checkAlongImpulse(position, 1, 1);
        this.checkAlongImpulse(position, 1, -1);
        this.checkAlongImpulse(position, -1, -1);
    }
    checkAlongImpulse(position, di, dj) {
        var i = position.i + di;
        var j = position.j + dj;
        while (this.legalPosition(i, j) == true) {
            i += di;
            j += dj;
        }
    }
}
