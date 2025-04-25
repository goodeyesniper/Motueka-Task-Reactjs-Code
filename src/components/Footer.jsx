import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <>
            <div className="container-fluid flex flex-col justify-center items-center bg-[#356993] text-[#ffffff]">
                <div className="container max-w-5xl px-2 mt-10 pb-15">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-start sm:items-start place-items-start sm:place-items-center pl-10">
                        <div className="flex flex-col">
                            <h1 className='text-[1.2rem] font-bold pb-2'>Motueka Task</h1>
                            <p><Link to="#">About Us</Link></p>
                            <p><Link to="#">Contact Us</Link></p>
                            <p><Link to="#">Privacy Policy</Link></p>
                            <p><Link to="#">Terms & Conditions</Link></p>
                        </div>
                        <div className="flex flex-col">
                            <h1 className='text-[1.2rem] font-bold pb-2'>More Details</h1>
                            <p><Link to="#">How it works</Link></p>
                            <p><Link to="#">Post tasks</Link></p>
                            <p><Link to="#">Browse tasks</Link></p>
                            <p><Link to="#">Earn Money</Link></p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end">
                            <h1 className='text-[1.2rem] font-bold pb-2'>Socials</h1>
                            <p>Facebook</p>
                            <p>Instagram</p>
                        </div>
                    </div>
                </div>
                <div className="container max-w-5xl text-center border-t">
                    <h1 className='py-5'>Copyright &copy; 2025</h1>
                </div>
            </div>
        </>
    )
}

export default Footer