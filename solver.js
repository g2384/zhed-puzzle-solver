class Cell {
    constructor(x, y, value = 0) {
        this._x = x;
        this._y = y;
        this._value = value;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get value() {
        return this._value;
    }
}

function solve2(cells, destination) {
    const rowCount = 10;
    const columnCount = 10;
    var cellsCount = cells.length;
    var lastCellIndex = cellsCount - 1;
    var combos = new Array(cellsCount);
    for (var i = 0; i < cellsCount; i++) {
        combos[i] = [1, 2, 3, 4];
    }

    var expectedLastCells = GetExpectedLastCells(cells, destination);
    var expectedLastDirections = [];
    for (var i = 0; i < expectedLastCells.length; i++) {
        expectedLastDirections.push(GetDirectionFromTo(expectedLastCells[i], destination));
    }
    var allCombos = combineArrays(combos);
    var allCombos2 = [];
    for (var i = 0; i < allCombos.length; i++) {
        if (expectedLastDirections.includes(allCombos[i][lastCellIndex])) {
            allCombos2.push(allCombos[i]);
        }
    }
    allCombos = allCombos2;
    var allCombosLength = allCombos.length;

    var p1 = performance.now();
    var permutations = FilterPermutations(cells, destination);
    var permutationsLength = permutations.length;
    var printLog = true;
    for (var c = 0; c < permutationsLength; c++) {
        var currentCells = permutations[c];
        var p2 = performance.now();
        if (printLog && c > 0) {
            var totalMs = ((p2 - p1) / c) * permutationsLength;
            var totalMin = Math.round(totalMs / 60) / 1000;
            console.log(Math.round(c / permutationsLength * 10000) / 100 + "%; estimated total time: " + totalMin + "min");
        }
        var lastCell = currentCells[lastCellIndex];
        var expectedLastDirection = GetDirectionFromTo(lastCell, destination);
        for (var i = 0; i < allCombosLength; i++) {
            if (allCombos[i][lastCellIndex] != expectedLastDirection) {
                continue;
            }
            var map = new Array(rowCount);
            for (var row = 0; row < rowCount; row++) {
                map[row] = new Array(columnCount);
                map[row].fill(false);
            }
            for (var i1 = 0; i1 < cellsCount; i1++) {
                var localCurrentCell = cells[i1];
                map[localCurrentCell.x][localCurrentCell.y] = true;
            }
            var currentCombo = allCombos[i].split("");
            for (var j = 0; j < currentCombo.length; j++) {
                var currentCell = currentCells[j];
                var x = currentCell.x;
                var y = currentCell.y;
                map[x][y] = true;
                var value = currentCell.value;
                switch (currentCombo[j]) {
                    case "1":
                        for (var v = 0; v < value; v++) {
                            while (x >= 0 && map[x][y]) {
                                x--;
                            }
                            if (x >= 0) {
                                map[x][y] = true;
                            } else {
                                break;
                            }
                        }
                        break;
                    case "2":
                        for (var v = 0; v < value; v++) {
                            while (y >= 0 && map[x][y]) {
                                y--;
                            }
                            if (y >= 0) {
                                map[x][y] = true;
                            } else {
                                break;
                            }
                        }
                        break;
                    case "3":
                        for (var v = 0; v < value; v++) {
                            while (x < rowCount && map[x][y]) {
                                x++;
                            }
                            if (x < rowCount) {
                                map[x][y] = true;
                            } else {
                                break;
                            }
                        }
                        break;
                    case "4":
                        for (var v = 0; v < value; v++) {
                            while (y < columnCount && map[x][y]) {
                                y++;
                            }
                            if (y < columnCount) {
                                map[x][y] = true;
                            } else {
                                break;
                            }
                        }
                        break;
                }
            }
            if (map[destination.x][destination.y]) {
                return [currentCells, toReadibleString(currentCombo)];
            }
        }
    }
}

function stringify(map, destination) {
    var rowCount = map.length;
    var columnCount = map[0].length;
    var result = "";
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < columnCount; j++) {
            if (i == destination.x && j == destination.y) {
                result += "x";
            } else {
                result += map[i][j] ? "o" : "_";
            }

        }
        result += "\n";
    }
    return result;
}

function GetDirectionFromTo(cellFrom, cellTo) {
    var x = cellFrom.x - cellTo.x;
    var y = cellFrom.y - cellTo.y;
    if (x == 0 && y == 0) {
        throw new Error("cannot get direction for overlapped cells");
    }
    if (x != 0 && y != 0) {
        throw new Error("cannot get direction for not aligned cells");
    }
    if (x == 0) {
        if (y < 0) {
            return "4"
        } else {
            return "2"
        }
    } else if (y == 0) {
        if (x < 0) {
            return "3";
        } else {
            return "1"
        }
    }
}

function GetExpectedLastCells(cells, destination) {
    var expectedLastCells = [];
    var cellsLength = cells.length;
    for (var i = 0; i < cellsLength; i++) {
        var cell = cells[i];
        if (cell.x == destination.x) {
            expectedLastCells.push(cell);
            continue;
        }
        if (cell.y == destination.y) {
            expectedLastCells.push(cell);
            continue;
        }
    }
    return expectedLastCells;
}

function FilterPermutations(cells, destination) {
    var permutations = permute(cells);
    var cellsLength = cells.length;
    var lastCellIndex = cellsLength - 1;
    var expectedLastCells = GetExpectedLastCells(cells, destination);
    var filtered = [];
    for (var i = 0; i < permutations.length; i++) {
        var permutation = permutations[i];
        var last = permutation[lastCellIndex];
        if (expectedLastCells.includes(last)) {
            filtered.push(permutation);
        }
    }

    return filtered;
}

function toReadibleString(arr) {
    var result = new Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
        result[i] = toDirection(arr[i]);
    }
    return result;
}

function toDirection(char) {
    switch (char) {
        case "1":
            return "top";
        case "2":
            return "left";
        case "3":
            return "bottom";
        case "4":
            return "right";
    }
}

function GetLength(obj) {
    return Object.keys(obj).length;
}

//#region permutation
function permute(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permute(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}
//#region permutation end

//#region combine arrays
function combineArrays(array_of_arrays) {

    // First, handle some degenerate cases...

    if (!array_of_arrays) {
        // Or maybe we should toss an exception...?
        return [];
    }

    if (!Array.isArray(array_of_arrays)) {
        // Or maybe we should toss an exception...?
        return [];
    }

    if (array_of_arrays.length == 0) {
        return [];
    }

    for (let i = 0; i < array_of_arrays.length; i++) {
        if (!Array.isArray(array_of_arrays[i]) || array_of_arrays[i].length == 0) {
            // If any of the arrays in array_of_arrays are not arrays or zero-length, return an empty array...
            return [];
        }
    }

    // Done with degenerate cases...

    // Start "odometer" with a 0 for each array in array_of_arrays.
    let odometer = new Array(array_of_arrays.length);
    odometer.fill(0);

    let output = [];

    let newCombination = formCombination(odometer, array_of_arrays);

    output.push(newCombination);

    while (odometer_increment(odometer, array_of_arrays)) {
        newCombination = formCombination(odometer, array_of_arrays);
        output.push(newCombination);
    }

    return output;
} /* combineArrays() */


// Translate "odometer" to combinations from array_of_arrays
function formCombination(odometer, array_of_arrays) {
    // In Imperative Programmingese (i.e., English):
    // let s_output = "";
    // for( let i=0; i < odometer.length; i++ ){
    //    s_output += "" + array_of_arrays[i][odometer[i]]; 
    // }
    // return s_output;

    // In Functional Programmingese (Henny Youngman one-liner):
    return odometer.reduce(
        function (accumulator, odometer_value, odometer_index) {
            return "" + accumulator + array_of_arrays[odometer_index][odometer_value];
        },
        ""
    );
} /* formCombination() */

function odometer_increment(odometer, array_of_arrays) {

    // Basically, work you way from the rightmost digit of the "odometer"...
    // if you're able to increment without cycling that digit back to zero,
    // you're all done, otherwise, cycle that digit to zero and go one digit to the
    // left, and begin again until you're able to increment a digit
    // without cycling it...simple, huh...?

    for (let i_odometer_digit = odometer.length - 1; i_odometer_digit >= 0; i_odometer_digit--) {

        let maxee = array_of_arrays[i_odometer_digit].length - 1;

        if (odometer[i_odometer_digit] + 1 <= maxee) {
            // increment, and you're done...
            odometer[i_odometer_digit]++;
            return true;
        } else {
            if (i_odometer_digit - 1 < 0) {
                // No more digits left to increment, end of the line...
                return false;
            } else {
                // Can't increment this digit, cycle it to zero and continue
                // the loop to go over to the next digit...
                odometer[i_odometer_digit] = 0;
                continue;
            }
        }
    } /* for( let odometer_digit = odometer.length-1; odometer_digit >=0; odometer_digit-- ) */

} /* odometer_increment() */
//#region combine arrays end