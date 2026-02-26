export default function TicketsPage(){
    return (
        <div className="container pb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="mb-4 text-center">Compra de Tickets</h2>
                            <form>
                                <h5 className="mb-3">Datos del comprador</h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" placeholder="Tu nombre" required/>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" placeholder="email@ejemplo.com"
                                               required/>
                                    </div>
                                </div>

                                <h5 className="mt-4 mb-3">Tipo de ticket</h5>

                                <div className="mb-3">
                                    <select className="form-select" required>
                                        <option value="">Selecciona un tipo</option>
                                        <option value="general">General - 10€</option>
                                        <option value="vip">VIP - 25€</option>
                                        <option value="premium">Premium - 40€</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Cantidad</label>
                                    <input type="number" className="form-control" min="1" max="10" value="1"/>
                                </div>

                                <h5 className="mt-4 mb-3">Payment Method</h5>

                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="payment" id="card" checked/>
                                    <label className="form-check-label" htmlFor="card">
                                        Tarjeta de crédito
                                    </label>
                                </div>

                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="radio" name="payment" id="paypal"/>
                                    <label className="form-check-label" htmlFor="paypal">
                                        PayPal
                                    </label>
                                </div>

                                <div className="alert alert-secondary mt-4">
                                    <strong>Resumen:</strong><br/>
                                    Tipo de ticket seleccionado<br/>
                                    Cantidad: X<br/>
                                    Total: €€
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Comprar tickets
                                </button>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
