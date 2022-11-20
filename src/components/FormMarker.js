import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import styles from './FormMarker.module.scss'
import { ClipLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import clientAxios from '../config/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth/authContext';
import { usePins } from '../context/pins/pinsContext';


const FormMarker = ({ newPlace, map, setNewPlace }) => {

    const { updatePinsUser } = useAuth()
    const { updateAllPins, editPin, setEditPin } = usePins();

    newPlace && map.flyTo({ center: [newPlace.long, newPlace.lat] })


    const newClientSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, 'Title is too short.')
            .max(20, 'Title is too long.')
            .required('Title is required.'),
        description: Yup.string()
            .min(3, 'Description is too short.')
            .max(50, 'Description is too long.')
            .required('Description is required.'),
        rating: Yup.string()
            .required('Rate is required.'),
    })


    // console.log(editPin)


    console.log(newPlace)
    const formSubmissionHandler = async (values) => {
        try {
            let response;
            if (editPin) {
                response = await clientAxios.put(`/pin/${editPin._id}`, values, { headers: { Authorization: Cookies.get('token') } });
            } else {
                values.lat = newPlace.lat;
                values.long = newPlace.long;
                response = await clientAxios.post("/pin", values, { headers: { Authorization: Cookies.get('token') } });
            }

            if (response.data.ok) {
                updateAllPins(response.data.pin, true);

                if (newPlace) setNewPlace(null);
                else setEditPin(null);
                updatePinsUser(response.data.pin, 'pins')
                toast.success('Your pin has been created successfully!')
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
                title: editPin?.title ?? '',
                description: editPin?.description ?? '',
                rating: editPin?.rating ?? ''
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
                        <div className={styles.containerInput}>
                            <label>Title</label>
                            <Field
                                placeholder="Enter a title*"
                                name="title"
                                className={errors.title && touched.title ? styles.inputError : ''}
                            />
                            <ErrorMessage name="title" component="div" className={styles.error} />
                        </div>
                        <div className={styles.containerInput}>
                            <label>Description</label>
                            <Field
                                placeholder="Enter a description*"
                                name="description"
                                as="textarea"
                                className={errors.description && touched.description ? styles.inputError : ''}
                            />
                            <ErrorMessage name="description" component="div" className={styles.error} />
                        </div>
                        <div className={styles.containerInput}>
                            <label>Rating</label>
                            <Field
                                placeholder="Tell us something about this place*"
                                name="rating"
                                as="select"
                                className={errors.rating && touched.rating ? styles.inputError : ''}
                            >
                                <option disabled="disabled" value="">Select a Rating*</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Field>
                        </div>
                        <button type="submit" disabled={isSubmitting || !(isValid && dirty)}>
                            {editPin ? 'Edit' : 'Create'}
                        </button>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormMarker