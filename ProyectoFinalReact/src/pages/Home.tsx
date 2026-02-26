import Hero from "./HomeSections/Hero.tsx";
import Features from "./HomeSections/Features.tsx";
import Cartelera from "./HomeSections/Cartelera.tsx";
import UserGuide from "./HomeSections/UserGuide.tsx";
import Testimonials from "./HomeSections/Testimonials.tsx";
import Stats from "./HomeSections/Stats.tsx";
import Blog from "./HomeSections/Blog.tsx";
export default function Home() {
    return(
        <div className="align-items-center">
            <Hero />
            <Features />
            <Cartelera />
            <UserGuide />
            <Testimonials />
            <Stats />
            <Blog />
        </div>
    )
}