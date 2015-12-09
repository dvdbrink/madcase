define(function() {
    function length(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    function normalise(x, y) {
        var l = length(x, y);
        x /= l;
        y /= l;
        return {
            x: x,
            y: y
        }
    }

    return {
        length,
        normalise
    };
});