import { useEffect } from 'react';

function useOutsideAlerter(ref, callback) {
    useEffect(() => {
        function handleClickOutside(event) {
            try {
                if (ref?.current && !ref.current.contains(event.target)) {
                    callback();
                }
            } catch (error) {
                console.log(error);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
}

export default useOutsideAlerter;
