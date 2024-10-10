// components/RotatingCircle.js
import { useEffect } from "react";
import { gsap } from "gsap";
import "./RotatingCircle.css"; // Ensure this file exists

const RotatingCircle = () => {
    useEffect(() => {
        gsap.to(".circle", {
            rotation: "+=360",
            duration: 19, // Adjust speed of rotation for the main circle
            repeat: -1,
            ease: "linear",
        });
    }, []);

    return (
        <>
            <div className="circle"></div>
        </>
    );
};

export default RotatingCircle;

