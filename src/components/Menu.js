import { useAuth } from '../context/auth/authContext'
import { MdStar, MdLogin, MdLogout } from "react-icons/md"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"
import { BsJournalText } from "react-icons/bs"
import styles from './Menu.module.scss'
import { useState } from 'react'
import ContainerAuth from './auth/ContainerAuth'
import ContainerUser from './user/ContainerUser'
import ContainerCard from './ui/ContainerCard'
import Modal from './ui/Modal'
import { usePins } from '../context/pins/pinsContext'
import { useMap } from 'react-map-gl'

const Menu = () => {

    const { isLoggedIn, logOut, user } = useAuth();
    const { pins, setCurrentPlaceId } = usePins();

    const [authForm, setAuthForm] = useState(null)
    const [optionsModal, setOptionsModal] = useState(null)
    const [topModal, setTopModal] = useState(null)

    const name = user.name && (user.name.split(' ')[0] || user.name);
    const { current: map } = useMap();

    const handlerRandom = () => {
        const randomPin = pins.allPins[Math.floor(Math.random() * pins.allPins.length)]
        map.flyTo({ center: [randomPin.long, randomPin.lat], zoom: 4 })
        setCurrentPlaceId(randomPin._id)
    }

    return (
        <div className={styles.containerMenu}>
            <div className={styles.logOptions}>
                {isLoggedIn ?
                    <>
                        <button onClick={() => setOptionsModal('pins')} className={styles.user}>Hi, <span>{name}</span></button>
                        <button onClick={logOut} className={styles.logOut}><MdLogout /><span>LogOut</span></button>
                    </>
                    :
                    <>
                        <button id="login" onClick={() => setAuthForm('login')} className={styles.login}><MdLogin /><span>LogIn</span></button>
                        <button onClick={() => setAuthForm('register')} className={styles.sign}><BsJournalText /><span>SignUp</span></button>
                    </>
                }
            </div>
            <button className={styles.top} onClick={() => setTopModal(true)}><MdStar /><span>TOP</span></button>
            <button className={styles.random} onClick={handlerRandom}><GiPerspectiveDiceSixFacesRandom /><span>Random</span></button>
            {topModal &&
                <Modal onClose={() => setTopModal(false)} closeWhite={true}>
                    <ContainerCard title={'Top Pins'} type={'topPins'} setModal={setTopModal} />
                </Modal>
            }
            {authForm && <ContainerAuth authForm={authForm} setAuthForm={setAuthForm} />}
            {optionsModal && <ContainerUser setModal={setOptionsModal} optionsModal={optionsModal} />}
        </div >
    )
}

export default Menu