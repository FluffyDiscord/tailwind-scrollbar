const plugin = require('tailwindcss/plugin');
const {
  BASE_STYLES,
  SCROLLBAR_SIZE_UTILITIES,
  buildSuffixMap,
  generateColorUtilities,
  generateRadiusUtilities,
  generateUtilitiesFromSuffixes,
  generateWidthUtilities
} = require('./utilities');
const { scrollbarAwareHover } = require('./variants');

const CUSTOM_VARIANTS = ['rounded'];

module.exports = plugin(tailwind => {
  const scrollbarVariants = tailwind.config('variants.scrollbar', []);

  const scrollbarColorUtilities = generateUtilitiesFromSuffixes(
    buildSuffixMap(tailwind.theme('colors', {}), tailwind.e),
    (k, v) => generateColorUtilities(k, v, scrollbarVariants.includes('hover'))
  );

  let scrollbarRadiusUtilities = {};
  if (scrollbarVariants.includes('rounded')) {
    scrollbarRadiusUtilities = generateUtilitiesFromSuffixes(
      buildSuffixMap(tailwind.theme('borderRadius', {}), tailwind.e),
      generateRadiusUtilities
    );
  }

  let scrollbarWidthUtilities = {};
  if (scrollbarVariants.includes('width')) {
    scrollbarWidthUtilities = generateUtilitiesFromSuffixes(
        buildSuffixMap(tailwind.theme('spacing', {}), tailwind.e),
        generateWidthUtilities
    );
  }

  tailwind.addBase(BASE_STYLES);

  tailwind.addUtilities({
    ...SCROLLBAR_SIZE_UTILITIES,
    ...scrollbarRadiusUtilities,
    ...scrollbarWidthUtilities,
  }, scrollbarVariants.filter(variant => !CUSTOM_VARIANTS.includes(variant)));

  tailwind.addUtilities(
    scrollbarColorUtilities,
    scrollbarVariants.filter(
      variant => variant !== 'hover' && !CUSTOM_VARIANTS.includes(variant)
    )
  );

  if (tailwind.config('mode') === 'jit') {
    tailwind.addVariant('hover', scrollbarAwareHover(tailwind.e));
  }
});
