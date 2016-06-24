package com.test;

/**
 * Created by amisnik on 24.06.2016.
 */
public class EquilibriumSolution {

    public int solution(int[] a) {
        if (a.length < 1) {
            return -1;
        }

        long[] sl = new long[a.length];
        long[] sr = new long[a.length];

        sl[0] = a[0];
        for (int i = 1; i < a.length; i++) {
            sl[i] = sl[i - 1] + a[i];
        }

        sr[a.length - 1] = a[a.length - 1];
        for (int i = a.length - 2; i >= 0; i--) {
            sr[i] = sr[i + 1] + a[i];
        }

        for (int i = 0; i < a.length; i++) {
            if (sl[i] == sr[i]) {
                return i;
            }
        }

        return -1;
    }
}
