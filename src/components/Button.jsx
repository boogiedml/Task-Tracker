import PropTypes from 'prop-types';

const Button = ({ color, text, onClick }) => {
  return (
    <button type="button" onClick={ onClick } style={{ backgroundColor: color }} className="btn">{ text }</button>
  )
}


Button.defaultProps = {
  backgroundColor: "indigo"
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string
}

export default Button