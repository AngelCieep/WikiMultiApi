export default function ContactPage(){
    return (
        <div className="container px-0 pb-5">
            <h1 className="mt-0">Contáctanos</h1>
            <div className="row g-4">

                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="mb-4">Contacto</h2>

                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input type="text" className="form-control" placeholder="Tu nombre" required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input type="email" className="form-control" placeholder="email@ejemplo.com"
                                           required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Asunto</label>
                                    <input type="text" className="form-control" placeholder="Asunto del mensaje"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mensaje</label>
                                    <textarea className="form-control" rows={5} placeholder="Escribe tu mensaje..."
                                              required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Enviar mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body p-0">
                            <iframe
                                src="https://www.google.com/maps?q=Madrid,España&output=embed"
                                width="100%"
                                height="100%"
                                style={{border:"0", minHeight: "450px"}}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
