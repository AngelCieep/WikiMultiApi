import {useState} from "react";
import {Login, Registrer} from "../components/LoginRegistrer.tsx";

export default function LoginRegistrerPage(){
    const  [isLogin, setIsLogin] = useState(true)
    const toogleForm =  () =>setIsLogin(!isLogin)
    return (
        <section className="pb-5">
            {isLogin ? <Login/> : <Registrer/>}
        <button className="btn btn-outline-primary py-2 mt-0" onClick={toogleForm}>
            {isLogin ? "Registrarse" : "Iniciar Sesion"}
        </button>
        </section>
    )
}
