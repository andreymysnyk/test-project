package com.test;

/**
 * Created by amisnik on 24.06.2016.
 */
public class AsymmetryIndexSolution {

    public int solution(int N) {
        int n = 1;//3;
        int a[] = {1};//3, 3, 4, 2, 5, 3};

        int[] al = new int[a.length + 1];
        int[] ar = new int[a.length + 1];

        al[0] = 0;
        for (int i = 1; i < a.length; i++) {
            al[i] += al[i - 1] + match(a[i - 1], n);
        }
        al[a.length] = al[a.length - 1] + match(a[a.length - 1], n);

        ar[a.length] = 0;
        ar[a.length - 1] = dismatch(a[a.length - 1], n);
        for (int i = a.length - 2; i >= 0; i--) {
            ar[i] = ar[i + 1] + dismatch(a[i], n);
        }

        for (int i = 0; i <= a.length; i++) {
            // if (left(a, n, i) == right(a, n, i)) {
            //     return i;
            // }

            if (al[i] == ar[i]) {
                return i;
            }
        }

        return -1;
    }

    private static int left(int[] a, int n, int j) {
        int cnt = 0;

        for (int i = 0; i < j; i++) {
            cnt += match(a[i], n);
        }

        return cnt;
    }

    private static int right(int[] a, int n, int j) {
        int cnt = 0;

        for (int i = j; i < a.length; i++) {
            cnt += dismatch(a[i], n);
        }

        return cnt;
    }

    private static int match(int x, int y) {
        return x == y ? 1 : 0;
    }

    private static int dismatch(int x, int y) {
        return x == y ? 0 : 1;
    }
}
