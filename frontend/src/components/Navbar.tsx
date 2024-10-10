import { useEffect } from "react";
import { gsap } from "gsap";

const Navbar: React.FC = () => {
    
    useEffect(() => {
        gsap.fromTo(".nav",
            { opacity: 0, delay: 1, duration : 2, y : 50 },
            {opacity: 100, y : 0}
        
        );
      }, []);

    return (
        <div className="grid grid-cols-6 w-screen pt-5 nav"> {/* Create 6-row grid */}
            <div className="col-start-2 col-span-1 flex justify-center items-center font-stratford">
                <img
                    src="https://img.icons8.com/?size=512&id=H5H0mqCCr5AV&format=png"
                    alt="Claude Icon"
                    className="w-16 h-16 mr-2"  // Adjust size and spacing
                />
                <div className="text-3xl">Claude</div>
            </div>
            <div className="col-start-5 col-span-1 flex justify-center items-center">
                <button className=" flex px-4 py-2 border border-gray-600 text-gray-600 rounded-xl hover:bg-pink-200 transition duration-300">

                    <div>
                        Build with Claude
                    </div>
                    <img
                        src="https://img.icons8.com/?size=512&id=99698&format=png"
                        alt="Up Right Icon"
                        className="w-4 h-4 ml-2 mt-1" // Adjust size and margin
                    />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
