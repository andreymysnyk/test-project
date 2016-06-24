package com.test;

/**
 * Created by amisnik on 24.06.2016.
 */
public class JumpHorseSolution {

    private static int x;
    private static int y;

    public static void main(String[] args) {
        x = 15;
        y = 15;

        // positive
        x = Math.abs(x);
        y = Math.abs(y);

        int moves = 0;

        swap();

        while (x > 2) {
            moves += jump();

            swap();
        }

        if ((x == 2) && (y == 1)) {
            moves += 1;
        } else if (((x == 2) && (y == 0)) || ((x == 1) && (y == 1))) {
            moves += 2;
        } else if ((x == 1) && (y == 0)) {
            moves += 3;
        } else if ((x == 2) && (y == 2)) {
            moves += 4;
        }

        System.out.println(moves);
    }

    private static int jump() {
        int moves = x / 2;

        // calculate next position
        x -= moves * 2;

        if (y >= moves) {
            y -= moves;
        } else {
            y = y % 2 == moves % 2 ? 0 : 1;
        }

        return moves;
    }

    private static void swap() {
        if (y > x) {
            int c = x;
            x = y;
            y = c;
        }
    }
}
