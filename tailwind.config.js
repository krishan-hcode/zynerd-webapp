/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        interSemibold: ['Inter-SemiBold', 'sans-serif'],
        interBold: ['Inter-Bold', 'sans-serif'],
        openSauceOne: ['Open Sauce One', 'sans-serif'],
        openSauceOneMedium: ['OpenSauceOne-Medium', 'sans-serif'],
        openSauceOneSemibold: ['OpenSauceOne-SemiBold', 'sans-serif'],
        openSauceOneBold: ['OpenSauceOne-Bold', 'sans-serif'],
        bizUdpmincho: ['BIZ UDPMincho', 'serif'],
        interMedium: ['Inter-Medium', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sauce: ['Open Sauce One', 'sans-serif'],
        mincho: ['BIZ UDPMincho', 'serif'],
        besley: ['Besley', 'sans-serif'],
        besleyMedium: ['Besley-Medium', 'sans-serif'],
        besleySemibold: ['Besley-SemiBold', 'sans-serif'],
        besleyBold: ['Besley-Bold', 'sans-serif'],
      },

      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      fontSize: {
        xxs: '10px',
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav':
          'calc(var(--screen-height, 100vh) - var(--height-nav))',
      },
      maxHeight: {
        'screen-no-nav':
          'calc(var(--screen-height, 100vh) - var(--height-nav))',
      },
      spacing: {
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)',
      },
      screens: {
        '3xl': '1750px', // 👈 custom breakpoint
      },
      colors: {
        lightPink: '#F9F5FF',
        lightGray: '#667085',
        cobalt: '#376FEF',
        skyBlue: '#7597e63b',
        primaryBlue: '#0483F7',
        bronze: '#FF8148',
        silver: '#8FA8DA',
        gold: '#FCA800',
        daimond: '#8D6EFF',
        red_400: '#FF6466',
        orange_900: '#F45E23',
        gray: {
          60: '#858E9C',
          70: '#546074',
          80: '#3B4960',
          90: '#24324C',
        },
        GREEN: '#34C759',
        GREEN_50: '#34c7594d',
        GREEN_200: '#34C75933',
        GREEN_100: '#34c75999',
        GREEN_300: '#3BB848',
        correct_choice_green: '#dcf3ea',
        wrong_choice_red: '#fee4e6',
        darkBlue: '#070063',
        lightBlue: {
          100: '#b3d9ff',
          200: '#376FEF',
          300: '#f3f8ff',
          400: '#0483F7',
          800: '#3B4960',
          500: '#0483F71A',
          900: '#0B1B38',
        },
        primaryDarkBlue: {
          10: '#0B1B38',
        },

        primary: {
          blue: '#0483F7',
          dark: '#0B1B38',
        },
        secondary: {
          purple: '#8D6EFF',
          orange: '#F45E23',
          orange3: '#F45E2308',
          neonBlue: '#5CE6FF',
          green: '#3BB848',
          red: '#FF6466',
          yellow: '#FFC02F',
          periwinkleBlue: '#8FA8DA',
          coralOrange: '#FF8148',
          lightRed: '#FF6F6F',
          cyan: '#44C9BE',
        },

        customGray: {
          3: '#F7F8F9',
          5: '#F2F3F5',
          10: '#E7E9EC',
          15: '#DBDDE1',
          20: '#CED1D7',
          30: '#B6BBC4',
          40: '#9DA4AF',
          50: '#858E9C',
          60: '#6C7688',
          70: '#546074',
          80: '#3B4960',
          90: '#24324C',
          100: '#F6F6F6',
          200: '#818181',
          300: '#4E4949',
        },
        skyBlue: {
          200: '#28459c',
        },
        extras: {
          dark5: 'rgba(11, 27, 56, 0.05)', // #0B1B38 at 5% opacity
          dark10: 'rgba(11, 27, 56, 0.10)', // #0B1B38 at 10% opacity
          dark20: 'rgba(11, 27, 56, 0.20)', // #0B1B38 at 20% opacity
          dark30: 'rgba(11, 27, 56, 0.30)', // #0B1B38 at 30% opacity
          blue3: '#F7FBFE',
          blue5: 'rgba(4, 131, 247, 0.05)', // #0483F7 at 5% opacity
          blue10: '#E6F3FF',
          blue20: 'rgba(4, 131, 247, 0.20)', // #0483F7 at 20% opacity
          blue30: 'rgba(4, 131, 247, 0.30)', // #0483F7 at 30% opacity
          blue40: 'rgba(4, 131, 247, 0.40)', // #0483F7 at 40% opacity
          blue50: 'rgba(4, 131, 247, 0.50)', // #0483F7 at 50% opacity
          blue60: '#45A8F9',
        },

        primary: {
          0: 'rgb(var(--color-primary-0)/<alpha-value>)',
          50: 'rgb(var(--color-primary-50)/<alpha-value>)',
          100: 'rgb(var(--color-primary-100)/<alpha-value>)',
          200: 'rgb(var(--color-primary-200)/<alpha-value>)',
          300: 'rgb(var(--color-primary-300)/<alpha-value>)',
          400: 'rgb(var(--color-primary-400)/<alpha-value>)',
          500: 'rgb(var(--color-primary-500)/<alpha-value>)',
          600: 'rgb(var(--color-primary-600)/<alpha-value>)',
          700: 'rgb(var(--color-primary-700)/<alpha-value>)',
          800: 'rgb(var(--color-primary-800)/<alpha-value>)',
          900: 'rgb(var(--color-primary-900)/<alpha-value>)',
          950: 'rgb(var(--color-primary-950)/<alpha-value>)',
          blue: '#0483F7',
          dark: '#0B1B38',
        },
        secondary: {
          0: 'rgb(var(--color-secondary-0)/<alpha-value>)',
          50: 'rgb(var(--color-secondary-50)/<alpha-value>)',
          100: 'rgb(var(--color-secondary-100)/<alpha-value>)',
          200: 'rgb(var(--color-secondary-200)/<alpha-value>)',
          300: 'rgb(var(--color-secondary-300)/<alpha-value>)',
          400: 'rgb(var(--color-secondary-400)/<alpha-value>)',
          500: 'rgb(var(--color-secondary-500)/<alpha-value>)',
          600: 'rgb(var(--color-secondary-600)/<alpha-value>)',
          700: 'rgb(var(--color-secondary-700)/<alpha-value>)',
          800: 'rgb(var(--color-secondary-800)/<alpha-value>)',
          900: 'rgb(var(--color-secondary-900)/<alpha-value>)',
          950: 'rgb(var(--color-secondary-950)/<alpha-value>)',
          purple: '#8D6EFF',
          orange: '#F45E23',
          orange3: '#F45E2308',
          neonBlue: '#5CE6FF',
          green: '#3BB848',
          red: '#FF6466',
          yellow: '#FFC02F',
          periwinkleBlue: '#8FA8DA',
          coralOrange: '#FF8148',
          lightRed: '#FF6F6F',
          cyan: '#44C9BE',
        },
        progressPurple: '#8D6EFF',
        darkPink: '#F45E23',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({addUtilities}) {
      const newUtilities = {
        '.num-lines-1': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
          overflow: 'hidden',
        },
        '.num-lines-2': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
          overflow: 'hidden',
        },
        '.num-lines-3': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
          overflow: 'hidden',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
