import React from 'react';
import Lottie from 'lottie-react';
import splashScreen from '../lotties/splashScreen.json';

const Loading: React.FC = () => {
    return (
        <div style={{
            flex: 1,
            backgroundColor: 'rgba(173, 216, 230, 0.7)', // Light blue with low opacity
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: "100vw",
            height: "100vh",
            overflow: 'hidden'
        }}>
            <Lottie
                animationData={splashScreen}
                autoPlay
                loop
                style={{
                    height: "100%"
                }}
            />
        </div>
    );
};

export default Loading;
