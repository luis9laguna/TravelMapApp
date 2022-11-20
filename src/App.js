import Map, { FullscreenControl } from "react-map-gl";
import { useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from "./components/ui/Pin";
import Menu from "./components/Menu";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from "./context/auth/authContext";
import { usePins } from "./context/pins/pinsContext";


function App() {

  const [newPlace, setNewPlace] = useState(null);
  const [timer, setTimer] = useState(null);
  const [zoom, setZoom] = useState(4);
  const [dragged, setDragged] = useState(false)

  const { isLoggedIn } = useAuth()
  const { pins } = usePins();


  const handleAddClick = (e) => {

    const { lat, lng } = e.lngLat

    if (isLoggedIn) {
      setNewPlace({
        lat,
        long: lng,
      });
    } else {
      document.querySelector('#login').click()
    }
  };

  const touchStart = () => {
    const timerId = setTimeout(() => {
      setTimer({ pass: true });
    }, 1000);

    setTimer(prev => ({ ...prev, id: timerId }))
  }

  const touchEnd = (e) => {
    clearTimeout(timer.id);
    if (timer.pass && !dragged) {
      handleAddClick(e)
    }
    setTimer(null)
    setDragged(false)
  }



  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        initialViewState={{
          longitude: 17.071727,
          latitude: 47.040182,
          zoom: 4
        }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{ height: "100%", width: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onDblClick={handleAddClick}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onDrag={() => setDragged(true)}
        onZoom={(e) => setZoom(e.viewState.zoom)}
      >

        {pins.allPins.map((pin, i) => <div key={i}><Pin pin={pin} zoom={zoom} /></div>)}

        {newPlace && <Pin newPlace={newPlace} zoom={zoom} newPin={isLoggedIn} setNewPlace={setNewPlace} />}
        <FullscreenControl />
        <Menu />
      </Map>
      <ToastContainer />
    </div>
  );
}

export default App;