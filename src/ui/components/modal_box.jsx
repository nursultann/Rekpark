import React, { useState, useRef, useEffect } from 'react';

const ModalBox = ({ children, modal }) => {
    const [containerHovered, setContainerHovered] = useState(false);
    const [modalHovered, setModalHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const containerRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)
                && (modalRef?.current && !modalRef.current.contains(event.target))) {
                setIsClicked(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [containerRef]);

    const handleContainerMouseEnter = () => {
        setContainerHovered(true);
    };

    const handleContainerMouseLeave = () => {
        setTimeout(() => {
            setContainerHovered(false);
        }, 300);
    };

    const handleModalMouseEnter = () => {
        setModalHovered(true);
    }

    const handleModalMouseLeave = () => {
        setTimeout(() => {
            setModalHovered(false);
        }, 300);
    }

    const handleTriggerClick = () => {
        setIsClicked(!isClicked);
    };

    const isVisible = containerHovered || modalHovered || isClicked;

    return (
        <div ref={containerRef}>
            <div
                onMouseEnter={handleContainerMouseEnter}
                onMouseLeave={handleContainerMouseLeave}
                onClick={handleTriggerClick}
            >
                {children}

                {isVisible &&
                    <div
                        className="relative z-50 w-full"
                        ref={modalRef}
                        onMouseEnter={handleModalMouseEnter}
                        onMouseLeave={handleModalMouseLeave}
                    >
                        <div className='absolute'>
                            {modal}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ModalBox;
