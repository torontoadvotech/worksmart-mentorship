import React, { ReactElement, Dispatch, SetStateAction, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { User as UserType, UserAuth } from '../../lib/types';
import { User } from '../../containers/user.container';
import * as Yup from 'yup';
import API from '../../lib/API';

interface Props {
  onLogIn: Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm({ onLogIn }: Props): ReactElement {
  const { setUser } = User.useContainer();
  const [error, setError] = useState(false);

  const initialValues: UserAuth = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string().required('Required')
  });

  const onSubmit = async (values: UserType) => {
    // Get input values from form
    const { email, password } = values;

    // Log the user in
    try {
      const res = await API.login({ email, password });
      // If login fails show an error
      if (res.error) {
        return setError(true);
      }

      // Add user res to container for later use
      setUser(res);

      onLogIn(true);
    } catch (err) {
      return console.log(err);
    }
  };

  return (
    <div className="login-form-container">
      <span className="text-slogan">
        The future<span>has female</span>
      </span>
      <h1>Sign in</h1>
      {error && <span className="login-error">Incorrect login details</span>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div className="field-container">
            <label htmlFor="email">Email</label>
            <ErrorMessage
              component="span"
              className="form-error"
              name="email"
            />
            <Field name="email" type="email" />
          </div>
          <div className="field-container">
            <label htmlFor="password">Password</label>
            <ErrorMessage
              component="span"
              className="form-error"
              name="password"
            />
            <Field name="password" type="password" />
          </div>
          <button type="submit" className="button-primary">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}
