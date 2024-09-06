import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    required: ({ label }) => `${label} is required`,
    default: ({ label }) => `${label} is invalid`,
  },
  string: {
    min: ({ label, min }) => `${label} must be at least ${min} characters long`,
    max: ({ label, max }) => `${label} must be at most ${max} characters long`,
    email: ({ label }) => `Please enter a valid email address for ${label}`,
  },
});

export default Yup;