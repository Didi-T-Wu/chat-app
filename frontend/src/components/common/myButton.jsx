import { Button } from "@chakra-ui/react"
import React from 'react';
import PropTypes from 'prop-types';

const myButton = ({ buttonText, ...props }) => {
        return (
            <Button {...props}>{buttonText}</Button>
        );
    }

Button.propTypes = {
    buttonText: PropTypes.string,
};

Button.defaultProps = {
    buttonText: '',
};

export default myButton;