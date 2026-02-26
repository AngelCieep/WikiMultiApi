import {testimonials} from "../../data/testimonials.ts";
import TestimonialCard from "../../components/TestimonialCard.tsx";

export default function Testimonials() {
    return (
        <>
            <section className=" container-fluid testimonials text-center bg-body-tertiary rounded-3 shadow">
                <h2 className="display-5 mb-5">Satisfied Clients Speaks</h2>

                <div className="d-flex flex-wrap justify-content-center">
                {testimonials.map((item, index) => (
                    <TestimonialCard key={index} {...item} />
                ))}
                </div>
            </section>
        </>

)
    ;
}