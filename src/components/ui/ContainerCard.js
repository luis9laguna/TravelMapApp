import React from 'react'
import { useAuth } from '../../context/auth/authContext'
import { usePins } from '../../context/pins/pinsContext'
import Card from './Card'
import styles from './ContainerCard.module.scss'

const ContainerCard = ({ title, setModal, type }) => {

    const { user } = useAuth()
    const { pins } = usePins()

    const arrayPins = type === 'topPins' ? pins : user

    return (
        <div className={`${styles.ContainerCard} ${type === 'topPins' ? styles.top : ''}`}>
            <h1>{title}</h1>
            <div>
                {arrayPins[type].map((pin, i) => (
                    <Card pin={pin} ownPin={user.pins.some(upin => upin._id === pin._id)} key={i} fromModal={true} setModal={setModal} />
                ))}
            </div>


        </div>
    )
}

export default ContainerCard