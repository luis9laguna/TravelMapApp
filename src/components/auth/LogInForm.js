import styles from './LogInForm.module.scss'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import GoogleLogin from 'react-google-login';
import { useAuth } from '../../context/auth/authContext';
import { MdEmail, MdLock } from 'react-icons/md';


const LoginForm = ({ setAuthForm }) => {

    const { logIn, logInGoogle } = useAuth()

    const newClientSchema = Yup.object().shape({
        email: Yup.string()
            .email('It must be a valid email.')
            .required('Email is required.'),
        password: Yup.string()
            .required('Password is required.')
    })

    //HANDLER GOOGLE
    const handleLogin = async googleData => logInGoogle({ token: googleData.tokenId })

    return (
        <Formik
            initialValues={{
                email: '',
                password: ''
            }}
            onSubmit={async (values, { resetForm }) => {
                await logIn(values)
                resetForm()
            }}
            validationSchema={newClientSchema}
        >
            {({ errors, touched, isSubmitting, isValid, dirty }) => {
                return (
                    <div className={styles.formContainer}>
                        <h1>LogIn</h1>
                        <Form>
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
                                <ErrorMessage name="password" component="div" className={styles.error} />
                            </div>

                            <button type="submit" disabled={isSubmitting || !(isValid && dirty)}>
                                Ingresar
                            </button>
                        </Form>
                        <span>You cant try using Google</span>

                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_ID}
                            render={renderProps => (
                                <button disabled={isSubmitting} onClick={renderProps.onClick} className={styles.google}>
                                    G
                                </button>
                            )}
                            onSuccess={handleLogin}
                            onFailure={handleLogin}
                            cookiePolicy={'single_host_origin'}
                        />

                        <span onClick={() => setAuthForm('register')}>Dont have yet an account? Register here!</span>
                    </div>

                )
            }}
        </Formik>
    )
}

export default LoginForm