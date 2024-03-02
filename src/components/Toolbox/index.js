import { useSelector, useDispatch} from 'react-redux';
import { COLORS, MENU_ITEMS } from '@/constants';
import styles from './index.module.css'
import { changeColor, changeBrushSize } from "@/slice/toolBoxSlice"
import cx from 'classnames'

import { socket } from "@/socket";

const Toolbox = () => {
    const dispatch = useDispatch()

    //this functionality is used to hide and show the menu when the Pencil icon is clicked and whhen the eraser is clicked accordingly
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    const showColorToolItem = activeMenuItem === MENU_ITEMS.PENCIL
    const showStrokeToolItem = activeMenuItem === MENU_ITEMS.PENCIL || MENU_ITEMS.ERASER
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])

    const updateBrushSize = (e) =>{
        dispatch(changeBrushSize({item:activeMenuItem, size:e.target.value}))
        socket.emit('changeConfig', {color, size:e.target.value})
    }
    const updateColor = (newColor) =>{
        dispatch(changeColor({item:activeMenuItem, color:newColor}))
        socket.emit('changeConfig', {color:newColor, size})
    }
    return (
        <div className={styles.toolBoxContainer}>
            {showColorToolItem && <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Brush Color</h4>
                <div className={styles.itemContainer}>
                <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.BLACK})} style={{backgroundColor:COLORS.BLACK}} onClick={()=>updateColor(COLORS.BLACK)}></div>
                <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.RED})} style={{backgroundColor:COLORS.RED}} onClick={()=>updateColor(COLORS.RED)}></div>
                <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.GREEN})} style={{backgroundColor:COLORS.GREEN}} onClick={()=>updateColor(COLORS.GREEN)}></div>
                <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.BLUE})} style={{backgroundColor:COLORS.BLUE}} onClick={()=>updateColor(COLORS.BLUE)}></div>
                <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.ORANGE})} style={{backgroundColor:COLORS.ORANGE}} onClick={()=>updateColor(COLORS.ORANGE)}></div>
                <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.YELLOW})} style={{backgroundColor:COLORS.YELLOW}} onClick={()=>updateColor(COLORS.YELLOW)}></div>
                </div>
            </div>}
            {showStrokeToolItem &&  <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Stroke Size</h4>
                <div className={styles.itemContainer}>
                    <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} value={size} />
                </div>
            </div>}
        </div>
    )
}

export default Toolbox;