import styles from './RegisterForm.module.scss'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { useAuth } from '../../context/auth/authContext';
import { MdEmail, MdLock, MdLockClock, MdPerson } from 'react-icons/md';


const RegisterForm = ({ setAuthForm }) => {


  const { userRegister } = useAuth()


  const newClientSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name is too short.')
      .max(20, 'Name is too long.')
      .required('Name is required.'),
    email: Yup.string()
      .email('It must be a valid email.')
      .max(30, 'Email is too long.')
      .required('Email is required.'),
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "The password must have 8 characters, 1 upper, 1 lower and 1 number.")
      .required('Password is required.'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'The passwords dont match.')
      .required('Confirm Password is required.'),
    acceptTerms: Yup.bool()
      .oneOf([true], 'You need to accept the terms to continue.')

  })

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmpassword: '',
        acceptTerms: false
      }}
      onSubmit={async (values, { resetForm }) => {
        await userRegister(values)
        resetForm()
      }}
      validationSchema={newClientSchema}
    >
      {({ errors, touched, isSubmitting, isValid, dirty }) => {
        return (
          <div className={styles.formContainer}>
            <h1>Registrar</h1>
            <Form className={styles.form}>
              <div className={styles.containerInput}>
                <MdPerson />
                <Field
                  placeholder="Name*"
                  type="text"
                  name="name"
                  className={errors.name && touched.name ? styles.inputError : ''}
                />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>

              <div className={styles.containerInput}>
                <MdEmail />
                <Field
                  placeholder="Email*"
                  type="email"
                  name="email"
                  className={errors.email && touched.email ? styles.inputError : ''}
                />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>

              <div className={styles.containerInput}>
                <MdLock />
                <Field
                  placeholder="Password*"
                  type="password"
                  name="password"
                  className={errors.password && touched.password ? styles.inputError : ''}
                />
                <ErrorMessage name="password" component="div" className={`${styles.error} ${styles.password}`} />
              </div>

              <div className={styles.containerInput}>
                <MdLockClock />
                <Field
                  placeholder="Confirm Password*"
                  type="password"
                  name="confirmpassword"
                  className={errors.confirmpassword && touched.confirmpassword ? styles.inputError : ''}
                />
                <ErrorMessage name="confirmpassword" component="div" className={styles.error} />
              </div>

              <div className={styles.acceptTerms}>
                <label htmlFor="acceptTerms" className="form-check-label">¿Do you accept terms and conditions?
                  <Field type="checkbox" id="acceptTerms" name="acceptTerms" />
                </label>
                <ErrorMessage name="acceptTerms" component="div" className={styles.error} />
              </div>

              <button type="submit" disabled={isSubmitting || !(isValid && dirty)}>
                Registrar
              </button>
            </Form>
            <span onClick={() => setAuthForm('login')}>¿Do you have an account? click here!</span>
          </div>
        )
      }}
    </Formik>
  )
}

export default RegisterForm