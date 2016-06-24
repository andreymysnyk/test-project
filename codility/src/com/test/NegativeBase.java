package com.test;

/**
 * Created by amisnik on 24.06.2016.
 */
public class NegativeBase {

    public static void main(String[] args) {
        System.out.println(base("100111", -2));
        System.out.println(base(23, -2));
        System.out.println(base("1101011", -2));
        System.out.println(base(-23, -2));

        for (int i = -9; i < 10; i++) {
            System.out.println(i + " - " + base(i, -2));
        }
    }

    private static int base(String number, int base) {
        int res = 0;

        for (int i = 0; i < number.length(); i++) {
            res += Integer.valueOf(number.charAt(i) + "") * Math.pow(base, i);
        }

        return res;
    }

    private static String base(int number, int base) {
        StringBuilder sb = new StringBuilder();

        while (number != 0) {
            int c = number;
            number = c / base;
            int remainder = c % base;

            if (remainder < 0) {
                remainder += Math.abs(base);
                number++;
            }

            sb.append(remainder);
        }

        return sb.length() == 0 ? "0" : sb.toString();
    }
}
