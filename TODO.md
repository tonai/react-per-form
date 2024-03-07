DONE

- different mode: 'blur' | 'change' | 'submit' (change means submit + change)
- native errors or custom errors
- custom validation
- cross inputs validation
- dynamic form
- global form validation
- custom message
- TU / e2e

TODO

- onSubmit send FormData
- error state for styling (use CSS ? Need a way to get the state)
- shouldFocusError: focus error field when not using native validation
- mode 'touched' (blur followed by change)
- manage select, textarea and other form elements
- should work with UI lib components like date pickers that update the value using JS (it does not trigger the onChange)
- Support Yup, Zod, AJV, Superstruct, Joi and others
  - https://github.com/jquense/yup
  - https://github.com/colinhacks/zod
  - https://github.com/ajv-validator/ajv
  - https://github.com/ianstormtaylor/superstruct
  - https://github.com/hapijs/joi
  - https://github.com/react-hook-form/resolvers
- add badges on README (check https://github.com/marketplace/actions/jest-coverage-comment)
- doc
- multiple validators ?
- force ?

FAQ

- if validator concern only one field, why not directly send the field value instead of returning an object containing only one property ?
  => it is problematic for validators that applies on a dynamic number of fields.  
   in that case the validator should both manage the case when names.length === 1, and value is not an object, and the case where value is an object
