import {blogPosts} from "../../data/testimonials.ts";
import BlogCard from "../../components/BlogCard.tsx";

export default function Blog() {
    return (
        <section className="container my-5">
            <h2>Blog Section</h2>
            <div className="d-flex justify-content-center gap-4">
                {blogPosts.map((post, index) => (
                    <BlogCard key={index} {...post} />
                ))}
            </div>
        </section>
    );
}