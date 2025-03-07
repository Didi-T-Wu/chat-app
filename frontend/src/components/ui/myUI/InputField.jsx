import { Input} from "@chakra-ui/react"
import {Field} from "../../ui/field"
import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({ label, ...props }) => {
  return (
    <Field label={label}>
      <Input {...props} />
    </Field>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
};

InputField.defaultProps = {
  label: '',
};

export default InputField;