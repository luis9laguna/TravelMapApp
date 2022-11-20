import { Marker, Popup, useMap } from "react-map-gl";
import { MdRoom } from "react-icons/md";
import Card from './Card';
import FormMarker from "../FormMarker";
import { useAuth } from "../../context/auth/authContext";
import styles from './Pin.module.scss'
import { usePins } from "../../context/pins/pinsContext";

const Pin = ({ pin, zoom, newPin, setNewPlace, newPlace }) => {

    const { user } = useAuth()
    const { pins, currentPlaceId, setCurrentPlaceId, editPin, setEditPin } = usePins()
    const { current: map } = useMap();

    const handleMarkerClick = () => {

        if (!newPin) {
            map.flyTo({ center: [pin.long, pin.lat], zoom: 4 })
            setCurrentPlaceId(pin._id);
        } else return;
    };


    const closePop = () => {
        if (newPin) setNewPlace(null)
        else if (editPin) { setEditPin(null); setCurrentPlaceId(null) }
        else setCurrentPlaceId(null)
    }

    const pinUser = pin && user.pins.some(upin => upin._id === pin?._id);
    const pinTop = pin && pins.topPins.some(upin => upin._id === pin?._id);

    return (
        <>
            <Marker
                latitude={pin?.lat || newPlace.lat}
                longitude={pin?.long || newPlace.long}
                offsetLeft={-3.5 * zoom}
                offsetTop={-7 * zoom}
            >
                <MdRoom
                    style={{
                        fontSize: (7 * zoom),
                        color:
                            pinTop ? "gold" : pinUser ? "tomato" : "slateblue",
                        cursor: "pointer",
                    }}
                    onClick={handleMarkerClick}
                />
            </Marker>
            {(newPin || pin?._id === currentPlaceId) &&
                <Popup
                    latitude={pin?.lat || newPlace.lat}
                    longitude={pin?.long || newPlace.long}
                    onClose={closePop}
                    anchor="top"
                    className={`${styles.popup} ${pinTop ? styles.top : ''}`}
                >
                    {newPin || editPin ?
                        <FormMarker newPlace={newPlace} map={map} setNewPlace={setNewPlace} />
                        :
                        <Card pin={pin} ownPin={pinUser} />
                    }
                </Popup>
            }
        </>
    )
}

export default Pin