import { faEraser, faFileDownload, faPencil, faRedo, faUndo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from 'classnames'
import styles from './index.module.css'
import { useDispatch, useSelector } from "react-redux"
import { menuItemClick, actionItemClick } from "@/slice/menuSlice"
import { MENU_ITEMS } from "@/constants"

export const Menu = () => {
    const dispatch = useDispatch()
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    
    const handleMenuClick = (itemName) => {
        dispatch(menuItemClick(itemName))
    }
    const handleActionClick = (itemName) => {
        dispatch(actionItemClick(itemName))
    }
    return(
        <div className={styles.menuContainer}>      
            {/* the cx syntax is used to manage the ,multiple stylles used in the single line for single item */}
            <div className={cx(styles.iconWrapper, {[styles.active]: activeMenuItem === MENU_ITEMS.PENCIL})} onClick={()=>handleMenuClick(MENU_ITEMS.PENCIL)}>
                <FontAwesomeIcon className={styles.icon} icon={faPencil} />
            </div>
            <div className={cx(styles.iconWrapper, {[styles.active]: activeMenuItem === MENU_ITEMS.ERASER})} onClick={()=>handleMenuClick(MENU_ITEMS.ERASER)}>
                <FontAwesomeIcon className={styles.icon} icon={faEraser}  />
            </div>
            <div className={styles.iconWrapper} onClick={()=>handleActionClick(MENU_ITEMS.UNDO)} >
                <FontAwesomeIcon className={styles.icon} icon={faUndo} />
            </div>
            <div className={styles.iconWrapper} onClick={()=>handleActionClick(MENU_ITEMS.REDO)}  >
                <FontAwesomeIcon className={styles.icon} icon={faRedo} />
            </div>
            <div className={styles.iconWrapper} onClick={()=>handleActionClick(MENU_ITEMS.DOWNLOAD)}  >
                <FontAwesomeIcon className={styles.icon} icon={faFileDownload} />
            </div>
        </div>
    )
}