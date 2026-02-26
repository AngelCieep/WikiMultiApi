export function Login() {
    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form className="container p-2" style={{width: "20rem"}}>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Username</label>
                    <input type="text" className="form-control" id="floatingInput" placeholder="Entre su usuario"/>
                </div>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Password</label>
                    <input type="password" className="form-control" id="floatingInput" placeholder="Entre su password"/>
                </div>
                <div className="form-check text-start my-3 mb-3">
                    <input className="form-check-input" type="checkbox"
                           value="remember-me" id="checkDefault"/> <label
                    className="form-check-label" htmlFor="checkDefault">
                    Remember me
                </label></div>

                <button className="btn btn-primary w-100 py-2 mt-34" type="submit">Log in</button>
            </form>
            <p className="mt-4">¿No tienes Cuenta?</p>
        </div>
    )
}

export function Registrer() {
    return (
        <div>
            <h1>Registrer Page</h1>
            <form className="container p-2 m-auto" style={{width: "40rem"}}>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Username</label>
                    <input type="text" className="form-control" id="floatingInput" placeholder="Entre su usuario"/>
                </div>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Nombre y Apellidos</label>
                    <input type="text" className="form-control" id="floatingInput" placeholder="Nombre Completo"/>
                </div>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Email</label>
                    <input type="email" className="form-control" id="floatingInput" placeholder="Email"/>
                </div>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Password</label>
                    <input type="password" className="form-control" id="floatingInput"
                           placeholder="Entre su password"/>
                </div>
                <div className="form-floating mb-3">
                    <label htmlFor="floatingInput">Confirm Password</label>
                    <input type="password" className="form-control" id="floatingInput"
                           placeholder="Confirme su password"/>
                </div>
                <div className="form-check text-start my-3 mb-3">
                    <input className="form-check-input" type="checkbox"
                           value="remember-me" id="checkDefault"/> <label
                    className="form-check-label" htmlFor="checkDefault">
                    Acepto terminos y condiciones. Coockies y politicas de privacidad.
                </label></div>
                <button style={{width: "20rem"}} className="btn btn-primary py-2 mt-34" type="submit">Sign up
                </button>

            </form>
            <p className="mt-4">¿Ya tienes Cuenta?</p>
        </div>
    )
}