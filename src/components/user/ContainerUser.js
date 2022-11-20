import styles from './ContainerUser.module.scss'
import Modal from '../ui/Modal'
import { MdPerson, MdRoom, MdFavorite, MdPassword } from 'react-icons/md';
import { AiFillIdcard } from 'react-icons/ai';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';
import ContainerCard from '../ui/ContainerCard';

const ContainerUser = ({ setModal, optionsModal }) => {

    return (
        <Modal onClose={() => setModal(null)}>
            <div className={styles.container}>
                <div className={styles.options}>
                    <div><MdPerson /></div>
                    <button className={optionsModal === 'pins' ? styles.active : ''} onClick={() => setModal('pins')}>
                        <MdRoom /><span>Your pins</span>
                    </button>
                    <button className={optionsModal === 'favs' ? styles.active : ''} onClick={() => setModal('favs')}>
                        <MdFavorite /><span>Favs pins</span>
                    </button>
                    <button className={optionsModal === 'info' ? styles.active : ''} onClick={() => setModal('info')}>
                        <AiFillIdcard /><span>User info</span>
                    </button>
                    <button className={optionsModal === 'change' ? styles.active : ''} onClick={() => setModal('change')}>
                        <MdPassword /><span>Change Password</span>
                    </button>
                </div>
                <div className={styles.optionsInfo}>
                    {optionsModal === 'pins' && <ContainerCard title={'Your Pins'} type={'pins'} setModal={setModal} />}
                    {optionsModal === 'favs' && <ContainerCard title={'Your Favorites'} type={'favs'} setModal={setModal} />}
                    {optionsModal === 'info' && <UserInfo />}
                    {optionsModal === 'change' && <ChangePassword />}
                </div>
            </div>
        </Modal>
    )
}

export default ContainerUser