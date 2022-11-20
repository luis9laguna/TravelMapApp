import { createContext, useContext } from 'react'

const pinsContext = createContext()

export const usePins = () => useContext(pinsContext);


export default pinsContext