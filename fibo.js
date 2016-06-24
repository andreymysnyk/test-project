function getFiboMax(max) {
    var i = 1;
    var fib = fibo(i);
    while (fib <= max) {
        fib = fibo(++i);
    }
    return fibo(i - 1);
}

function fibo(n) {
    return n > 2 ? fibo(n - 1) + fibo(n - 2) : 1;
}

function fibo_(n) {
    var prev = 1, prev_2 = 1;
    if (n <= 2) {
        return 1;
    } else {
        var next = 0;
        for (var i = 2; i < n; i++) {
            next = prev + prev_2;
            prev_2 = prev;
            prev = next;
        }
        return next;
    }
}

function fibo_max(max) {
    var prev = 1, prev_2 = 1;
    var next = 0;
    while (next <= max) {
        next = prev + prev_2;
        prev_2 = prev;
        prev = next;
    }
    return prev_2;
}

console.log('hi there!');
console.log(fibo_(1) + ' ' + fibo(1));
console.log(fibo_(2) + ' ' + fibo(2));
console.log(fibo_(3) + ' ' + fibo(3));
console.log(fibo_(4) + ' ' + fibo(4));
console.log(fibo_(5) + ' ' + fibo(5));
console.log(fibo_(6) + ' ' + fibo(6));
console.log('max');
console.log(getFiboMax(1) + ' ' + fibo_max(1));
console.log(getFiboMax(2) + ' ' + fibo_max(2));
console.log(getFiboMax(3) + ' ' + fibo_max(3));
console.log(getFiboMax(5) + ' ' + fibo_max(5));
console.log(getFiboMax(7) + ' ' + fibo_max(7));
console.log(getFiboMax(8) + ' ' + fibo_max(8));
console.log(getFiboMax(9) + ' ' + fibo_max(9));
console.log(getFiboMax(54) + ' ' + fibo_max(54));
console.log(getFiboMax(55) + ' ' + fibo_max(55));
console.log(getFiboMax(56) + ' ' + fibo_max(56));

// 1 2 3 4 5 6  7  8  9 10
// 1 1 2 3 5 8 13 21 34 55

/*

    getFibonacci(5) == 5;
    getFibonacci(7) == 5;
    getFibonacci(8) == 8;

*/