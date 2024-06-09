import React from 'react';
import DynamicSelect from 'react-select'; // Make sure to install and import react-select

const SelectComponent = ({ options, onChange }) => {
  return (
    <DynamicSelect
      options={options}
      onChange={onChange}
      isClearable
      className='h-12'
    />
  );
};

export default SelectComponent;
