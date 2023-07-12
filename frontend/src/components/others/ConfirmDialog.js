import './confirmDialog.css'
import confirmDialogSlice from '../../reducers/componentsReducer/confirmDialog/confirmDialogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const ConfirmDialog = () => {
    const dialog = useSelector(state => state.confirmDialog.confirmation)
    const dispatch = useDispatch()

    useEffect(() => {
        if(dialog.show){
            document.body.classList.add('modal-open')
        }
    }, [dialog])

    useEffect(() => {
        const ele = document.getElementById('confirm-dialog-wrapper') 
        ele.addEventListener('mouseup' , handleClickOutside)
        return () => {
            ele.removeEventListener('mouseup', handleClickOutside)
        }
    }, [])
    
    const handleClickOutside = () => {
        const ele = document.getElementById('confirm-dialog-wrapper') 
        let container = document.getElementById('confirm-dialog-container')
        ele.addEventListener('mouseup' , (e) => {
            if(!container.contains(e.target)){
                document.body.classList.remove('modal-open')
                dispatch(confirmDialogSlice.actions.setConfirmDialog({show: false, title: '' , res: false}))
            }
        } , {once: true})
    }

    return (
            <div id="confirm-dialog-container">
                <div id='confirm-dialog-title'> {dialog?.title} </div> 
                <div id='confirm-dialog-btn-section'>
                    <div id='confirm-dialog-cancel' className='confirm-dialog-btn' onClick={() => {
                        dispatch(confirmDialogSlice.actions.setConfirmDialog({show: false, title: '', res: false}))
                        document.body.classList.remove('modal-open')
                    }}> Hủy </div>    
                    <div id='confirm-dialog-accept' className='confirm-dialog-btn' onClick={() => {
                        dispatch(confirmDialogSlice.actions.setConfirmDialog({...dialog, res: true}))
                    }}> Xác nhận </div>    
                </div> 
            </div>
    )
}

export default ConfirmDialog