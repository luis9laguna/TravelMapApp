import styles from './FormUser.module.scss'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import clientAxios from '../../config/axios'
import Cookies from 'js-cookie'
import { MdEmail, MdPerson } from 'react-icons/md'
import { useAuth } from '../../context/auth/authContext'

const UserInfo = () => {

    const { user, updateUser } = useAuth();

    const newClientSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Name is too short.')
            .max(20, 'Name is too long.')
            .required('Name is required.'),
    })


    const formSubmissionHandler = async values => {

        try {
            const response = await clientAxios.put('/user', values, { headers: { Authorization: Cookies.get('token') } });
            if (response.data.ok) {
                toast.success('Your name has been updated succesfully!')
                updateUser(values.name)
            } else {
                toast.error('An error occured, please try later')
            }
        } catch (error) {
            toast.error('An error occured, please try later')
        }

    }

    return (
        <Formik
            initialValues={{
                name: user.name ?? '',
            }}
            enableReinitialize
            onSubmit={async (values, { resetForm }) => {
                formSubmissionHandler(values)
                resetForm()
            }}
            validationSchema={newClientSchema}
        >
            {({ errors, touched, isSubmitting, isValid, dirty }) => {
                return (

                    <Form className={styles.formContainer}>
                        <h1 className={styles.title}>User information</h1>
                        <div className={styles.containerInput}>
                            <label>Name*</label>
                            <div>
                                <MdPerson />
                                <Field
                                    placeholder="Name*"
                                    name="name"
                                    className={errors.name && touched.name ? styles.inputError : ''}
                                />
                            </div>
                            <ErrorMessage name="name" component="div" className={styles.error} />
                        </div>
                        <div className={styles.email}>
                            <label>Email</label>
                            <div><MdEmail /><span>{user.email}</span></div>
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

export default UserInfo