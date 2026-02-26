type ItemProps = {
    name: string;
    icon: string;
    description: string;
}
export default function  FeaturesItem({name, icon, description}:ItemProps){
    return(
        <div className="d-flex flex-column border border-2 border-dark rounded-4 p-3 m-2 cardPeli" style={{width: "18rem"}}>
            <div className="rounded-4 d-flex justify-content-center align-items-center mb-3 ">
                <img className="w-75" src={icon} alt={name}/>
            </div>
            <div>
                <h3>{name}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}