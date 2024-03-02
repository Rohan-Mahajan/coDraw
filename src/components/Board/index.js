import { MENU_ITEMS } from "@/constants";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { menuItemClick, actionItemClick } from "@/slice/menuSlice"

import { socket } from "@/socket";

const Board = () => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch()
    const drawHistory = useRef([])
    const historyPointer = useRef(0)
    const shouldDraw = useRef(false);
    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu);
    const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

    useEffect(()=>{
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
            const URL = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = URL
            anchor.download = 'sketch.png'
            anchor.click()
            // console.log(URL)
        } else if(actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO){
            if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -=1
            if(historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current +=1
            const imageData = drawHistory.current[historyPointer.current]
            context.putImageData(imageData, 0,0)
        }
        dispatch(actionItemClick(null))

    },[actionMenuItem, dispatch, historyPointer])

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const changeConfig = (color, size) => {
            context.strokeStyle = color; // Corrected spelling
            context.lineWidth = size;
        };
        const handleChangeConfig = (config) => {
            changeConfig(config.color, config.size)
        }
        changeConfig(color, size);
        socket.on('changeConfig' , handleChangeConfig)
        
        return () => {
            socket.off('changeConfig' , handleChangeConfig)
        }
    }, [color, size]);

    //mount
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // When mounting
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const beginPath = (x,y)=>{
            context.beginPath();
            context.moveTo(x,y);
        }
        const drawPath = (x,y)=>{
            context.lineTo(x,y);
            context.stroke();
        }
        const handleMouseDown = (e) => {
            shouldDraw.current = true;
            beginPath(e.clientX, e.clientY);
            socket.emit('beginPath', {x:e.clientX, y:e.clientY})
        };
        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return;
            drawPath(e.clientX, e.clientY);
            socket.emit('drawLine', {x:e.clientX, y:e.clientY})
        };
        const handleMouseUp = (e) => {
            shouldDraw.current = false;
            const imageData = context.getImageData(0,0,canvas.width, canvas.height)
            drawHistory.current.push(imageData)
            historyPointer.current = drawHistory.current.length-1
        };

        const handleBeginPath = (path)=>{
            beginPath(path.x, path.y);
        }
        const handleDrawLine = (path)=>{
            drawPath(path.x, path.y);
        }

        canvas.addEventListener('mousedown', handleMouseDown); // Corrected method name
        canvas.addEventListener('mousemove', handleMouseMove); // Corrected method name
        canvas.addEventListener('mouseup', handleMouseUp); // Corrected method name

        socket.on('beginPath', handleBeginPath)
        socket.on('drawLine', handleDrawLine)
        
        // client-side
        socket.on("connect", () => {
            console.log("client connected"); // x8WIv7-mJelg7on_ALbx
        });
        
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown); // Corrected method name
            canvas.removeEventListener('mousemove', handleMouseMove); // Corrected method name
            canvas.removeEventListener('mouseup', handleMouseUp); // Corrected method name
            socket.off('beginPath', handleBeginPath)
            socket.off('drawLine', handleDrawLine)
        };
    }, []);

    console.log(color, size);
    return (
        <canvas ref={canvasRef}></canvas>
    );
};

export default Board;


// import { useEffect, useRef } from "react";
// import { UseDispatch, useSelector } from "react-redux";

// const Board = () => {
//     const canvasRef = useRef(null);
//     const shouldDraw = useRef(false);
//     const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
//     const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])

//     useEffect(() => {
//         if(!canvasRef.current) return
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         const changeConfig = () => {
//             context.strokeColor = color
//             context.lineWidth = size
//         }

//         changeConfig()
//     }, [color, size]);

//     useEffect( () => {
//         if(!canvasRef.current) return
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         //when mounting
//         canvas.width = window.innerWidth
//         canvas.height = window.innerHeight

//         const handleMouseDown = (e) => {
//             shouldDraw.current = true
//             context.beginPath()
//             context.moveTo(e.clientX, e.clientY)
//         }
//         const handleMouseMove = (e) => {
//             if(!shouldDraw.current) return
//             context.lineTo(e.clientX, e.clientY)
//             context.stroke()
//         }
//         const handleMouseUp = (e) => {
//             shouldDraw.current = false
//         }

//         canvas.addEventListner('mousedown', handleMouseDown)
//         canvas.addEventListner('mousemove', handleMouseMove)
//         canvas.addEventListner('mouseup', handleMouseUp)
        
//         return () => {
//             canvas.removeEventListner('mousedown', handleMouseDown)
//             canvas.removeEventListner('mousemove', handleMouseMove)
//             canvas.removeEventListner('mouseup', handleMouseUp)            
//         }
//     } ,[])

//     // console.log(color, size)
//     return(
//         <canvas ref={canvasRef} ></canvas>
//     )
// }

// export default Board;