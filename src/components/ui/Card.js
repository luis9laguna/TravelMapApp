import { useMap } from "react-map-gl";
import Cookies from "js-cookie"
import { MdStar, MdFavorite, MdEdit, MdDelete } from "react-icons/md"
import TimeAgo from 'react-timeago'
import Swal from "sweetalert2"
import clientAxios from "../../config/axios"
import { useAuth } from "../../context/auth/authContext"
import styles from './Card.module.scss'
import { toast } from "react-toastify";
import { usePins } from "../../context/pins/pinsContext";

const Card = ({ pin, ownPin, fromModal, setModal }) => {

    const { updatePinsUser, user, isLoggedIn } = useAuth()
    const { updateAllPins, pins, setCurrentPlaceId, setEditPin } = usePins();
    const { current: map } = useMap();

    const topPin = pins.topPins.some(upin => upin._id === pin._id);
    const favPin = user.favs.some(upin => upin._id === pin._id);

    const goHandler = () => {
        map.flyTo({ center: [pin.long, pin.lat], zoom: 4 })
        setCurrentPlaceId(pin._id)
        setModal(null)
    }

    const handlerLike = async () => {

        if (!isLoggedIn) {
            document.querySelector('#login').click()
            return
        }
        const response = await clientAxios.get(`/like/${pin._id}`, { headers: { Authorization: Cookies.get('token') } });
        const { data } = response;

        if (data.ok) {

            updateAllPins(data.pin, true, true)
            if (data.added) {
                toast.success('You have added this pin to favorites!', { theme: "colored" })
                updatePinsUser(data.pin, 'favs')

            } else {
                toast.success('You have remove this pin out of favorites!', { theme: "dark" })
                updatePinsUser(data.pin, 'favs', true)
            }

        } else {
            toast.error('An error occured, please try later')
        }

    }

    const handlerUpdate = () => {
        setEditPin(pin)
        if (fromModal) goHandler()
    }


    const handlerDeletePin = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Once deleted, you won't be able to recover it!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!'

        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await clientAxios.delete(`/pin/${pin._id}`, { headers: { Authorization: Cookies.get('token') } });

                if (response.data.ok) {
                    Swal.fire(
                        '¡Eliminado!',
                        'Eliminado correctamente',
                        'success'
                    )
                    updateAllPins(pin, false, true)
                    updatePinsUser(pin, 'pins', true)
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occured, please try later'
                    })
                }
            }
        })
    }

    return (
        <div className={`${styles.card} ${fromModal ? styles.wModal : ''} ${ownPin ? styles.colorOwn : ''} ${topPin ? styles.top : ''}`}>
            <label>Place</label>
            <h2>{pin.title}</h2>
            <label>Review</label>
            <p>{pin.description}</p>
            <label>Rating</label>
            <div className={styles.star}>{Array(pin.rating).fill(<MdStar />)}</div>
            <label>Created by</label>
            <div className={styles.containerCreated}>
                <div>
                    <span className={styles.user}>
                        {ownPin ? 'You' : pin.user.name}
                    </span>
                    <span><TimeAgo date={pin.createdAt} /></span>
                </div>
                <div className={styles.buttons}>
                    {ownPin ?
                        <>
                            <button onClick={handlerUpdate} className={styles.edit}><MdEdit /></button>
                            <button onClick={handlerDeletePin} className={styles.delete}><MdDelete /></button>
                        </>
                        :
                        <button onClick={handlerLike} className={`${styles.fav} ${favPin ? styles.favPin : ''}`}><MdFavorite /></button>
                    }
                </div>
            </div>
            {fromModal &&
                <button onClick={goHandler} className={styles.go}>Go</button>
            }
            {topPin && <span className={styles.topStar}><MdStar /></span>}
        </div>
    )
}

export default Card