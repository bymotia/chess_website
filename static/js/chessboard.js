document.addEventListener('DOMContentLoaded', function() {
    var board,
        game = new Chess();

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('chessboard', cfg);

    function onDragStart (source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^b/) !== -1) {
            return false;
        }
    };

    function onDrop (source, target) {
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        removeGreySquares();
        if (move === null) {
            return 'snapback';
        }

        updateStatus();
    };

    function onMouseoverSquare (square, piece) {
        var moves = game.ugly_moves({
            square: square,
            verbose: true
        });

        if (moves.length === 0) return;

        greySquare(square);

        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
    };

    function onMouseoutSquare (square, piece) {
        removeGreySquares();
    };

    function onSnapEnd () {
        board.position(game.fen());
    };

    function updateStatus () {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        }

        if (game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        else if (game.in_draw() === true) {
            status = 'Game over, it is a draw.';
        }

        else {
            status = moveColor + ' to move';

            if (game.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        console.log(status);
    };

    function greySquare (square) {
        var squareEl = $('#chessboard .square-' + square);

        var background = '#a9a9a9';
        if (squareEl.hasClass('black-3c85d')) {
            background = '#696969';
        }

        squareEl.css('background', background);
    };

    function removeGreySquares () {
        $('#chessboard .square-55d63').css('background', '');
    };
});

