import styles from './FormUser.module.scss'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import clientAxios from '../../config/axios'
import Cookies from 'js-cookie'
import { MdLock, MdLockClock, MdLockOpen } from 'react-icons/md'

const ChangePassword = () => {

    const newClientSchema = Yup.object().shape({
        oldpassword: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                "The password must have 8 characters, 1 upper, 1 lower and 1 number.")
            .required('Password is required.'),
        newpassword: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                "The password must have 8 characters, 1 upper, 1 lower and 1 number.")
            .required('Password is required.'),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('newpassword'), null], 'The passwords dont match.')
            .required('Confirm Password is required.'),
    })


    const formSubmissionHandler = async values => {

        try {
            const response = await clientAxios.put('auth/change-password', values, { headers: { Authorization: Cookies.get('token') } });

            if (response.data.ok) {
                toast.success('Your Password has been changed succesfully!')
            } else {
                toast.error('An error occured, please try later')
            }
        } catch (error) {
            if (error.response.data.message === 'Invalid Password') {
                toast.error('Invalid Password')
            }
            else {
                toast.error('An error occured, please try later')
            }
        }
    }

    return (
        <Formik
            initialValues={{
                oldpassword: '',
                newpassword: '',
                confirmpassword: '',

            }}
            onSubmit={async (values, { resetForm }) => {
                formSubmissionHandler(values)
                resetForm()
            }}
            validationSchema={newClientSchema}
        >
            {({ errors, touched, isSubmitting, isValid, dirty }) => {
                return (

                    <Form className={styles.formContainer}>
                        <h1 className={styles.title}>Change your Password</h1>

                        <div className={styles.containerInput}>
                            <label htmlFor='oldpassword'>Old Password*</label>
                            <div>
                                <MdLockOpen />
                                <Field
                                    placeholder="Old Password*"
                                    name="oldpassword"
                                    className={errors.oldpassword && touched.oldpassword ? styles.inputError : ''}
                                />
                            </div>
                            <ErrorMessage name="oldpassword" component="div" className={styles.error} />
                        </div>

                        <div className={styles.containerInput}>
                            <label htmlFor='password'>New Password*</label>
                            <div>
                                <MdLock />
                                <Field
                                    placeholder="New Password*"
                                    name="newpassword"
                                    className={errors.newpassword && touched.newpassword ? styles.inputError : ''}
                                />
                            </div>
                            <ErrorMessage name="newpassword" component="div" className={styles.error} />
                        </div>
                        <div className={styles.containerInput}>
                            <label htmlFor='confirmpassword'>Confirm Password*</label>
                            <div>
                                <MdLockClock />
                                <Field
                                    placeholder="Change Password*"
                                    name="confirmpassword"
                                    className={errors.confirmpassword && touched.confirmpassword ? styles.inputError : ''}
                                />
                            </div>
                            <ErrorMessage name="confirmpassword" component="div" className={styles.error} />
                        </div>

                        <button type="submit" disabled={isSubmitting || !(isValid && dirty)}>
                            Cambiar
                        </button>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ChangePassword