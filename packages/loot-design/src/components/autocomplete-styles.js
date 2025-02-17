import { styles as actualStyles, colors } from '../style';

const colourStyles = {
  ...actualStyles.lightScrollbar,
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid rgb(208, 208, 208)',
    borderRadius: 4,
    outline: 0,
    marginLeft: -1,
    marginRight: 1,
    padding: '5px 3px',
    minHeight: 'auto',
  }),
  input: styles => ({
    ...styles,
    padding: 0,
    margin: 0,
  }),
  menuPortal: styles => ({
    ...styles,
    zIndex: 5000,
  }),
  menu: (styles, { selectProps }) => ({
    ...styles,
    backgroundColor: colors.n1,
    marginTop: 2,
    marginBottom: 2,
    position: selectProps.embedded ? 'relative' : styles.position,
    overflow: 'hidden',
  }),
  menuList: styles => ({
    ...styles,
    padding: 0,

    // Custom scrollbar styling
    ...Object.entries(actualStyles.lightScrollbar).reduce(
      (carry, [key, value]) => ({
        ...carry,
        [key.replace('& ', '')]: value,
      }),
      {},
    ),
  }),
  group: styles => ({
    ...styles,
    padding: '5px 0 0',
  }),
  groupHeading: styles => ({
    ...styles,
    color: colors.y9,
    textTransform: 'none',
    paddingLeft: '9px',
    fontSize: '100%',
    fontWeight: 'normal',
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? colors.n5 : undefined,
    color: 'white',
    padding: '3px 20px',
    fontSize: 13,
  }),
  valueContainer: styles => ({ ...styles, padding: 'none' }),
  clearIndicator: styles => ({
    ...styles,
    padding: 'none',
    '> svg': { height: 15, width: 15 },
  }),
  multiValue: styles => ({ ...styles, backgroundColor: colors.b9 }),
};

export default colourStyles;
