import React from "react";
import { components } from "react-select";
const { ValueContainer, Placeholder } = components;

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const baseUrl = BASE_URL.split('api/v1');

export const constants = {
    PAGE_LIMIT: 10,
    RIGHT_INPUT: 'success',
    WRONG_INPUT: 'error',
    BUILD: false,
    tinyAapiKey: 'lgm7d6th53hm5dehjg5mloc3r4nsbzbuwn740vgx0pp7kts2',
    PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    STRIPE_CLIENT_ID: process.env.REACT_APP_STRIPE_CLIENT_ID,
    PAYPAL_BASE_URL: process.env.REACT_APP_SERVE==='DEV' ? 'https://www.sandbox.paypal.com/connect?flowEntry=static' : 'https://www.paypal.com/connect?flowEntry=static',
    FRONT_URL: process.env.REACT_APP_FRONT_URL
    //PAYPAL_BASE_URL: 'https://www.sandbox.paypal.com/connect?flowEntry=static'
}

export const selectStyle = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? '#fff' : '',
        "&:active": {
            backgroundColor: '#30CDCC',
            color: '#fff',
        },
        backgroundColor: state.isSelected ? '#30CDCC' : (state.isFocused ? '#DEEBFF' : ''),
    }),
    input: (provided) => ({
        ...provided,
        color: "#817F7F",
        height: '100%',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex:10
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        overflow: "visible",
        padding: "0 16px",
        height: '35px',
    }),
}

export const dashboardSelectStyle = {
  option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#fff' : '',
      "&:active": {
          backgroundColor: '#30CDCC',
          color: '#fff',
      },
      backgroundColor: state.isSelected ? '#30CDCC' : (state.isFocused ? '#DEEBFF' : ''),
  }),
  input: (provided) => ({
      ...provided,
      color: "#817F7F",
      height: '100%',
  }),
  menu: (provided) => ({
      ...provided,
      zIndex:10
  }),
  valueContainer: (provided, state) => ({
      ...provided,
      overflow: "visible",
      padding: "0 16px",
      height: '35px',
      width:'110px'
  }),
}

export const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused} className={props.hasValue || props.selectProps.inputValue ? 'select-floating-label' : ''}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, child =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };

  export const usaStates =([
    { value: 'Alaska', label: 'Alaska' },
    { value: 'Alabama', label: 'Alabama' },
    { value: 'Arkansas', label: 'Arkansas' },
    { value: 'Arizona', label: 'Arizona' },
    { value: 'California', label: 'California' },
    { value: 'Colorado', label: 'Colorado' },
    { value: 'Connecticut', label: 'Connecticut' },
    { value: 'District of Columbia', label: 'District of Columbia' },
    { value: 'Delaware', label: 'Delaware' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Hawaii', label: 'Hawaii' },
    { value: 'Iowa', label: 'Iowa' },
    { value: 'Idaho', label: 'Idaho' },
    { value: 'Illinois', label: 'Illinois' },
    { value: 'Indiana', label: 'Indiana' },
    { value: 'Kansas', label: 'Kansas' },
    { value: 'Kentucky', label: 'Kentucky' },
    { value: 'Louisiana', label: 'Louisiana' },
    { value: 'Massachusetts', label: 'Massachusetts' },
    { value: 'Maryland', label: 'Maryland' },
    { value: 'Maine', label: 'Maine' },
    { value: 'Michigan', label: 'Michigan' },
    { value: 'Minnesota', label: 'Minnesota' },
    { value: 'Missouri', label: 'Missouri' },
    { value: 'Mississippi', label: 'Mississippi' },
    { value: 'Montana', label: 'Montana' },
    { value: 'North Carolina', label: 'North Carolina' },
    { value: 'North Dakota', label: 'North Dakota' },
    { value: 'Nebraska', label: 'Nebraska' },
    { value: 'New Hampshire', label: 'New Hampshire' },
    { value: 'New Jersey', label: 'New Jersey' },
    { value: 'New Mexico', label: 'New Mexico' },
    { value: 'Nevada', label: 'Nevada' },
    { value: 'New York', label: 'New York' },
    { value: 'Ohio', label: 'Ohio' },
    { value: 'Oklahoma', label: 'Oklahoma' },
    { value: 'Oregon', label: 'Oregon' },
    { value: 'Pennsylvania', label: 'Pennsylvania' },
    { value: 'Puerto Rico', label: 'Puerto Rico' },
    { value: 'Rhode Island', label: 'Rhode Island' },
    { value: 'South Carolina', label: 'South Carolina' },
    { value: 'South Dakota', label: 'South Dakota' },
    { value: 'Tennessee', label: 'Tennessee' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Utah', label: 'Utah' },
    { value: 'Virginia', label: 'Virginia' },
    { value: 'Vermont', label: 'Vermont' },
    { value: 'Washington', label: 'Washington' },
    { value: 'Wisconsin', label: 'Wisconsin' },
    { value: 'West Virginia', label: 'West Virginia' },
    { value: 'Wyoming', label: 'Wyoming' }
  ]);

  export const editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'fontColor', 'fontBackgroundColor',
        'italic',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'insertTable',
        '|',
        'undo',
        'redo'
      ]
    },
    table: {
      contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    },
  }

  export const tinyConfigEmailContent ={
      height: 400,
      menubar: false,
      force_br_newlines : true,
      force_p_newlines : false,
      forced_root_block : '', // Needed for 3.x
      branding: false,
      statusbar: false,
      content_style:
      "body {color: #817F80; font-size: 14px; font-family: 'Helvetica Neue',sans-serif; }",
      plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'table'
      ],
      toolbar:
          'bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table '
  }

  export const tinyConfig ={
    height: 200,
    menubar: false,
    branding: false,
    statusbar: false,
    force_br_newlines : true,
    force_p_newlines : false,
    forced_root_block : '', // Needed for 3.x
    content_style:
    "body {color: #817F80; font-size: 14px; font-family: 'Helvetica Neue',sans-serif; }",
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'table'
    ],
    toolbar:
        'bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table '
}

  export const dummyEmailContent = "Hi Jessica,<br/><br/>Below is the link to a quote for Jerry’s birthday party event. I have included all the details and instructions. Please review the quote and pay deposit when you get a chance.<br/><br/> Let me know if you have any questions. <br/><br/> VIEW_QUOTE_BUTTON  <br/><br/>  Thanks, <br/><br/> Business/Person Name"
  
  
  
  
 
  