import { useEffect } from 'react';
import { deletenote } from '../store/notes';
import { useRecoilState } from 'recoil';

function useCheckDeleteState() {
    const [deleteState, setDeleteState] = useRecoilState(deletenote);

    useEffect(() => {
        if (deleteState) {
            setDeleteState(false);
        }
    }, [deleteState, setDeleteState]);
}

export default useCheckDeleteState;
